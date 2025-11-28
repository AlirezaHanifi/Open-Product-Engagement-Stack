window.matomoConfig = window.matomoConfig || {
    baseUrl: "http://localhost/",
    siteId: 1
};

function initializeMatomoTracking() {
    const config = window.matomoConfig;
    
    window._paq = window._paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['trackAllContentImpressions']);
    _paq.push(['trackAllOutlinks']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['setDocumentTitle', document.title]);

    (function() {
        _paq.push(['setTrackerUrl', config.baseUrl + 'matomo.php']);
        _paq.push(['setSiteId', config.siteId]);
        const script = document.createElement('script');
        script.async = true;
        script.src = config.baseUrl + 'matomo.js';
        document.getElementsByTagName('script')[0].parentNode.insertBefore(script, document.getElementsByTagName('script')[0]);
    })();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMatomoTracking);
} else {
    initializeMatomoTracking();
}
