(()=>{
  if(window.__vyrdictNewsletterWelcomePopupV6)return;
  window.__vyrdictNewsletterWelcomePopupV6=1;
  window.__vyrdictNewsletterAutoPopupDisabled=1;

  // Newsletter signup is now intentionally user-initiated from the primary
  // Newsletter entry in the site navigation. Keep this legacy file as a
  // harmless compatibility shim so older cached pages never auto-open a popup.
  window.VyrdictNewsletterLegacyPopup={
    open(){window.VyrdictNewsletter?.open?.()},
    close(){window.VyrdictNewsletter?.close?.()}
  };
})();
