export interface HeaderAnalysis {
    status: 'secure' | 'weak' | 'missing';
    value: string | null;
    score: number;
    maxScore: number;
    recommendation: string;
    description: string;
}

export interface SecurityReport {
    url: string;
    totalScore: number;
    maxTotalScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    riskLabel: string;
    riskDescription: string;
    headers: Record<string, HeaderAnalysis>;
    timestamp: string;
}

/**
 * Standards-aligned Security Analysis Engine
 * Focuses on responsible risk interpretation vs. security hardening.
 */
export function analyzeHeaders(url: string, rawHeaders: Headers): SecurityReport {
    const results: Record<string, HeaderAnalysis> = {};

    // 1. Content-Security-Policy (CSP) - Hardening Max 8 pts
    const csp = rawHeaders.get('content-security-policy');
    const hasFrameAncestors = csp?.includes('frame-ancestors');

    if (!csp) {
        results['Content-Security-Policy'] = {
            status: 'missing', value: null, score: 0, maxScore: 8,
            description: 'Controls which resources the browser is allowed to load.',
            recommendation: 'Implement a strict CSP to prevent XSS and data injection attacks.'
        };
    } else {
        const hasDefault = csp.includes('default-src');
        const hasScript = csp.includes('script-src');
        const hasObject = csp.includes('object-src');
        const hasTrustedTypes = csp.includes('require-trusted-types-for');

        let status: 'secure' | 'weak' = 'weak';
        let score = 2;
        let rec = 'Your CSP is weak. Ensure default-src, script-src, and object-src are defined.';

        if (hasDefault && hasScript && hasObject) {
            status = 'secure';
            score = 8;
            rec = 'Excellent CSP configuration.';
        } else if (hasDefault || hasScript || hasObject) {
            status = 'weak';
            score = 5;
            rec = 'Your CSP is partial. Add missing default-src, script-src, or object-src.';
        } else if (hasFrameAncestors || hasTrustedTypes) {
            status = 'weak';
            score = 2;
            rec = 'CSP only covers specific protections. Enhance it with a default policy.';
        }

        results['Content-Security-Policy'] = {
            status, value: csp, score, maxScore: 8,
            description: 'Controls which resources the browser is allowed to load.',
            recommendation: rec
        };
    }

    // 2. Strict-Transport-Security (HSTS) - Critical Max 6 pts
    const hsts = rawHeaders.get('strict-transport-security');
    if (!hsts) {
        results['Strict-Transport-Security'] = {
            status: 'missing', value: null, score: 0, maxScore: 6,
            description: 'Forces the browser to use HTTPS only.',
            recommendation: 'Enable HSTS with a long max-age (e.g., 1 year).'
        };
    } else {
        const match = /max-age=(\d+)/i.exec(hsts);
        const maxAge = match ? parseInt(match[1]) : 0;
        const hasSubdomains = hsts.toLowerCase().includes('includesubdomains');

        // Secure if maxAge >= 1 year
        const isSecure = maxAge >= 31536000;
        results['Strict-Transport-Security'] = {
            status: isSecure ? 'secure' : 'weak',
            value: hsts,
            score: isSecure ? 6 : 2,
            maxScore: 6,
            description: 'Forces the browser to use HTTPS only.',
            recommendation: isSecure
                ? (hasSubdomains ? 'HSTS is correctly configured.' : 'Secure, but adding includeSubDomains is recommended.')
                : 'Ensure max-age is ≥ 31536000 (1 year).'
        };
    }

    // 3. X-Frame-Options (XFO) - Critical Max 1 pt
    const xfo = rawHeaders.get('x-frame-options')?.toUpperCase();
    if (!xfo) {
        results['X-Frame-Options'] = {
            status: 'missing', value: null, score: 0, maxScore: 1,
            description: 'Prevents clickjacking.',
            recommendation: hasFrameAncestors ? 'Missing, but mitigated by CSP frame-ancestors.' : 'Set to DENY or SAMEORIGIN.'
        };
    } else {
        const isSecure = xfo.includes('DENY') || xfo.includes('SAMEORIGIN');
        results['X-Frame-Options'] = {
            status: isSecure ? 'secure' : 'weak',
            value: xfo,
            score: isSecure ? 1 : 0,
            maxScore: 1,
            description: 'Prevents clickjacking.',
            recommendation: isSecure ? 'Frame protection active.' : 'Use DENY or SAMEORIGIN.'
        };
    }

    // 4. X-Content-Type-Options - Critical Max 1 pt
    const xcto = rawHeaders.get('x-content-type-options')?.toLowerCase();
    const isXCTOSecure = xcto === 'nosniff';
    results['X-Content-Type-Options'] = {
        status: isXCTOSecure ? 'secure' : 'missing',
        value: xcto || null,
        score: isXCTOSecure ? 1 : 0,
        maxScore: 1,
        description: 'Prevents MIME-sniffing.',
        recommendation: isXCTOSecure ? 'Secure.' : 'Set to nosniff.'
    };

    // 5. Referrer-Policy - Hardening Max 1 pt
    const ref = rawHeaders.get('referrer-policy')?.toLowerCase();
    const safeRef = ['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'];
    if (ref) {
        const policies = ref.split(',').map(p => p.trim());
        const isSecure = policies.some(p => safeRef.includes(p));
        results['Referrer-Policy'] = {
            status: isSecure ? 'secure' : 'weak',
            value: ref,
            score: isSecure ? 1 : 0,
            maxScore: 1,
            description: 'Controls referrer information.',
            recommendation: isSecure ? 'Secure.' : 'Use strict-origin-when-cross-origin.'
        };
    } else {
        results['Referrer-Policy'] = {
            status: 'missing', value: null, score: 0, maxScore: 1,
            description: 'Controls referrer information.',
            recommendation: 'Implement a secure policy.'
        };
    }

    // 6. Permissions-Policy - Hardening Max 1 pt
    const pp = rawHeaders.get('permissions-policy');
    results['Permissions-Policy'] = {
        status: pp ? 'secure' : 'missing',
        value: pp || null,
        score: pp ? 1 : 0,
        maxScore: 1,
        description: 'Restricts browser features.',
        recommendation: pp ? 'Secure.' : 'Define a policy.'
    };

    // 7. Cross-Origin Isolation (COOP/COEP) - Hardening Max 2 pts
    const coop = rawHeaders.get('cross-origin-opener-policy');
    const coep = rawHeaders.get('cross-origin-embedder-policy');
    const isCOSecure = coep?.includes('require-corp') && coop === 'same-origin';
    results['Cross-Origin-Isolation'] = {
        status: isCOSecure ? 'secure' : (coop || coep ? 'weak' : 'missing'),
        value: `COOP: ${coop || 'None'}, COEP: ${coep || 'None'}`,
        score: isCOSecure ? 2 : 0,
        maxScore: 2,
        description: 'Process isolation.',
        recommendation: isCOSecure ? 'Secure.' : 'Set COOP: same-origin and COEP: require-corp.'
    };

    // 🧠 Risk Interpretation Logic
    // Critical Headers: HSTS, XFO (or CSP frame-ancestors), XCTO
    const hasHSTS = results['Strict-Transport-Security'].status !== 'missing';
    const hasXFO = results['X-Frame-Options'].status !== 'missing' || hasFrameAncestors;
    const hasXCTO = results['X-Content-Type-Options'].status !== 'missing';

    const hstsWeak = results['Strict-Transport-Security'].status === 'weak';
    const xfoWeak = results['X-Frame-Options'].status === 'weak' && !hasFrameAncestors;
    const xctoWeak = false; // XCTO is either nosniff or missing

    let riskLevel: 'Low' | 'Medium' | 'High' = 'High';
    let riskLabel = 'High Risk';
    let riskDescription = 'One or more critical security headers are missing.';

    if (hasHSTS && hasXFO && hasXCTO) {
        if (hstsWeak || xfoWeak) {
            riskLevel = 'Medium';
            riskLabel = 'Medium Risk';
            riskDescription = 'Core security headers are present but have minor configuration weaknesses.';
        } else {
            riskLevel = 'Low';
            riskLabel = 'Low Risk';
            riskDescription = 'Core security protections are enabled. Some advanced hardening headers are missing.';
        }
    } else if (!hasHSTS || !hasXFO || !hasXCTO) {
        riskLevel = 'High';
        riskLabel = 'Attention Required';
        riskDescription = 'One or more critical core protections (HSTS, Frame Protection, or Sniffing Protection) are missing.';
    }

    const totalScoreValue = Object.values(results).reduce((acc, curr) => acc + curr.score, 0);
    const totalScore = Math.min(20, totalScoreValue);

    return {
        url,
        totalScore,
        maxTotalScore: 20,
        riskLevel,
        riskLabel,
        riskDescription,
        headers: results,
        timestamp: new Date().toISOString()
    };
}
