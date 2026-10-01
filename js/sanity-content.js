(() => {
  'use strict';

  const config = {
    projectId: 'rx0hc1vo',
    dataset: 'production',
    apiVersion: '2026-10-01',
    timeoutMs: 6000,
  };

  const pageIds = {
    '': 'homePage',
    'index.html': 'homePage',
    'services.html': 'servicesPage',
    'portfolio.html': 'portfolioPage',
    'contact.html': 'contactPage',
  };

  const filename = (window.location.pathname.split('/').pop() || '').toLowerCase();
  const pageId = pageIds[filename];

  if (!pageId) return;

  const text = (selectorOrNode, value) => {
    if (value === undefined || value === null || value === '') return;
    const node = typeof selectorOrNode === 'string'
      ? document.querySelector(selectorOrNode)
      : selectorOrNode;
    if (node) node.textContent = value;
  };

  const href = (node, value) => {
    if (node && value) node.setAttribute('href', value);
  };

  const setButton = (node, cta) => {
    if (!node || !cta) return;
    href(node, cta.href);
    if (cta.label) {
      const arrow = node.querySelector('.btn-arrow');
      if (arrow) {
        node.replaceChildren(document.createTextNode(`${cta.label} `), arrow);
      } else {
        node.textContent = cta.label;
      }
    }
    if (cta.newTab) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener');
    } else {
      node.removeAttribute('target');
      if (node.getAttribute('rel') === 'noopener') node.removeAttribute('rel');
    }
  };

  const setParagraphs = (nodes, values) => {
    if (!Array.isArray(values)) return;
    nodes.forEach((node, index) => {
      if (values[index]) node.textContent = values[index];
    });
  };

  const setHeadingWithBreaks = (node, value) => {
    if (!node || !value) return;
    const parts = String(value).split(/\n+/).map((part) => part.trim()).filter(Boolean);
    if (parts.length <= 1) {
      node.textContent = value;
      return;
    }
    node.replaceChildren();
    parts.forEach((part, index) => {
      if (index) node.append(document.createElement('br'));
      node.append(document.createTextNode(part));
    });
  };

  const setMeta = (name, contentValue) => {
    if (!contentValue) return;
    let node = document.querySelector(`meta[name="${name}"]`);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute('name', name);
      document.head.append(node);
    }
    node.setAttribute('content', contentValue);
  };

  const setCanonical = (url) => {
    if (!url) return;
    let node = document.querySelector('link[rel="canonical"]');
    if (!node) {
      node = document.createElement('link');
      node.setAttribute('rel', 'canonical');
      document.head.append(node);
    }
    node.setAttribute('href', url);
  };

  const applySeo = (page, settings) => {
    const seo = {
      ...(settings?.defaultSeo || {}),
      ...(page?.seo || {}),
    };

    if (seo.metaTitle) document.title = seo.metaTitle;
    setMeta('description', seo.metaDescription);
    setCanonical(seo.canonicalUrl);

    if (typeof seo.noIndex === 'boolean') {
      setMeta('robots', seo.noIndex ? 'noindex, nofollow' : 'index, follow');
    }
  };

  const applyNavigation = (settings) => {
    if (!Array.isArray(settings?.navigation)) return;
    const anchors = [...document.querySelectorAll('#nav-links a')];

    settings.navigation.forEach((item, index) => {
      const anchor = anchors[index];
      if (!anchor) return;
      if (item.label) anchor.textContent = item.label;
      href(anchor, item.href);
      anchor.classList.toggle('nav-cta', Boolean(item.isPrimary));
    });
  };

  const applyFooterColumns = (settings) => {
    if (!Array.isArray(settings?.footerColumns)) return;

    const columns = [...document.querySelectorAll('.footer-column')].filter(
      (column) => !column.querySelector('.footer-socials')
    );

    settings.footerColumns.forEach((columnData, columnIndex) => {
      const column = columns[columnIndex];
      if (!column) return;

      text(column.querySelector('h3'), columnData.heading);

      if (!Array.isArray(columnData.links)) return;
      const existingLinks = [...column.querySelectorAll('a')];

      columnData.links.forEach((linkData, linkIndex) => {
        let anchor = existingLinks[linkIndex];
        if (!anchor) {
          anchor = document.createElement('a');
          column.append(anchor);
        }
        text(anchor, linkData.label);
        href(anchor, linkData.href);
      });

      existingLinks.slice(columnData.links.length).forEach((anchor) => anchor.remove());
    });
  };

  const applySocialLinks = (settings) => {
    const links = Array.isArray(settings?.socialLinks) ? settings.socialLinks : [];

    const instagram = links.find((item) =>
      String(item.platform || item.label || '').toLowerCase().includes('instagram')
    );
    const email = links.find((item) => {
      const descriptor = String(item.platform || item.label || '').toLowerCase();
      return descriptor.includes('email') || String(item.url || '').startsWith('mailto:');
    });

    const instagramAnchor = document.querySelector('.footer-social-instagram');
    const emailAnchor = document.querySelector('.footer-social-email');

    if (instagram?.url && instagramAnchor) {
      instagramAnchor.href = instagram.url;
      instagramAnchor.title = instagram.label || settings.instagramHandle || 'Instagram';
    } else if (settings?.instagramUrl && instagramAnchor) {
      instagramAnchor.href = settings.instagramUrl;
      instagramAnchor.title = settings.instagramHandle || 'Instagram';
    }

    if (email?.url && emailAnchor) {
      emailAnchor.href = email.url;
      emailAnchor.title = email.label || settings.email || 'Email Designing Virtuosity';
    } else if (settings?.email && emailAnchor) {
      emailAnchor.href = `mailto:${settings.email}`;
      emailAnchor.title = settings.email;
    }
  };

  const applyShared = (settings) => {
    if (!settings) return;

    applyNavigation(settings);

    text('.footer-meta', settings.footerMeta);
    text('.footer-statement', settings.footerStatement);

    const projectCard = document.querySelector('.footer-project-card');
    if (projectCard) {
      text(projectCard.querySelector('.eyebrow'), settings.footerProjectEyebrow);
      text(projectCard.querySelector('strong'), settings.footerProjectHeading);
      text(projectCard.querySelector('.footer-project-action'), settings.footerProjectAction);
      href(projectCard, settings.footerProjectHref);
    }

    applyFooterColumns(settings);
    applySocialLinks(settings);
  };

  const applyMarquee = (terms) => {
    if (!Array.isArray(terms) || !terms.length) return;
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    track.replaceChildren();
    [...terms, ...terms].forEach((term) => {
      const span = document.createElement('span');
      span.textContent = term;
      track.append(span);
    });
  };

  const applyProofCards = (cards) => {
    if (!Array.isArray(cards)) return;
    const nodes = [...document.querySelectorAll('.work-grid .work-card')];

    cards.forEach((card, index) => {
      const node = nodes[index];
      if (!node) return;

      href(node, card.href);
      text(node.querySelector('h3'), card.title);

      const description = node.querySelector('p');
      if (description) text(description, card.description);

      const meta = node.querySelector('.work-meta');
      if (meta && Array.isArray(card.tags)) {
        meta.replaceChildren();
        card.tags.forEach((tag) => {
          const pill = document.createElement('span');
          pill.className = 'pill';
          pill.textContent = tag;
          meta.append(pill);
        });
      }
    });
  };

  const applyCapabilityHighlights = (items) => {
    if (!Array.isArray(items)) return;
    const nodes = [...document.querySelectorAll('.capability-grid .capability')];

    items.forEach((item, index) => {
      const node = nodes[index];
      if (!node) return;
      href(node, item.href);
      text(node.querySelector('.num'), item.number);
      text(node.querySelector('h3'), item.title);
      text(node.querySelector('p'), item.description);
    });
  };

  const applyPrinciples = (items) => {
    if (!Array.isArray(items)) return;
    const nodes = [...document.querySelectorAll('.principles .principle')];

    items.forEach((item, index) => {
      const node = nodes[index];
      if (!node) return;
      text(node.querySelector('.principle-number'), item.number);
      text(node.querySelector('h3'), item.title);
      text(node.querySelector('p'), item.description);
    });
  };

  const applyTimeline = (items) => {
    if (!Array.isArray(items)) return;
    const nodes = [...document.querySelectorAll('.evolution-timeline .evolution-step')];

    items.forEach((item, index) => {
      const node = nodes[index];
      if (!node) return;
      text(node.querySelector('strong'), item.period);
      text(node.querySelector('span'), item.label);
    });
  };

  const applyHome = (page) => {
    if (!page) return;

    text('.hero-topline .kicker', page.heroEyebrow);
    const heroCopy = document.querySelector('.hero-topline p:not(.kicker)');
    text(heroCopy, page.heroSupportingCopy);

    text('.hero .display span:first-child', page.heroHeadlineTop);
    text('.hero .display .gradient-word', page.heroHeadlineAccent);

    const heroButtons = [...document.querySelectorAll('.hero-actions .btn')];
    setButton(heroButtons[0], page.heroPrimaryCta);
    setButton(heroButtons[1], page.heroSecondaryCta);

    const heroStat = document.querySelector('.hero-stat');
    if (heroStat && (page.heroStatNumber || page.heroStatLabel)) {
      const strong = document.createElement('strong');
      strong.textContent = page.heroStatNumber || '';
      heroStat.replaceChildren(strong, document.createTextNode(page.heroStatLabel ? ` ${page.heroStatLabel}` : ''));
    }

    applyMarquee(page.marqueeTerms);

    const proofSection = document.querySelector('.work-grid')?.closest('.section');
    if (proofSection) {
      text(proofSection.querySelector('.section-head .kicker'), page.proofEyebrow);
      text(proofSection.querySelector('.section-head .section-title'), page.proofHeading);
      text(proofSection.querySelector('.section-head .lede'), page.proofClientCopy);
    }
    applyProofCards(page.proofCards);

    const capabilitySection = document.querySelector('.capability-grid')?.closest('.section');
    if (capabilitySection) {
      text(capabilitySection.querySelector('.section-head .kicker'), page.capabilitiesEyebrow);
      text(capabilitySection.querySelector('.section-head .section-title'), page.capabilitiesHeading);
      text(capabilitySection.querySelector('.section-head .lede'), page.capabilitiesIntro);
    }
    applyCapabilityHighlights(page.capabilityHighlights);

    const philosophy = document.querySelector('.philosophy');
    if (philosophy) {
      text(philosophy.querySelector('.philosophy-intro .kicker'), page.philosophyEyebrow);
      text(philosophy.querySelector('.philosophy-intro .section-title'), page.philosophyHeading);
      setParagraphs(
        [...philosophy.querySelectorAll('.manifesto-panel p')],
        page.philosophyParagraphs
      );
    }
    applyPrinciples(page.principles);

    if (Array.isArray(page.continuum)) {
      const nodes = [...document.querySelectorAll('.design-continuum .continuum-node')];
      nodes.forEach((node, index) => {
        if (page.continuum[index]) node.textContent = page.continuum[index];
      });
    }

    const established = document.querySelector('.established');
    if (established) {
      text(established.querySelector('.established-copy .kicker'), page.aboutEyebrow);
      setHeadingWithBreaks(established.querySelector('.established-copy .section-title'), page.aboutHeading);
      setParagraphs(
        [...established.querySelectorAll('.established-copy > p:not(.kicker)')],
        page.aboutParagraphs
      );
    }
    applyTimeline(page.timeline);

    const closing = document.querySelector('.cta-band');
    if (closing) {
      text(closing.querySelector('.cta-copy h2'), page.closingHeading);
      text(closing.querySelector('.cta-copy p'), page.closingBody);
      setButton(closing.querySelector('.btn'), page.closingCta);
    }
  };


  const applyServicePanels = (services) => {
    if (!Array.isArray(services)) return;
    const nodes = [...document.querySelectorAll('.service-stack .service-panel')];

    services.forEach((service, index) => {
      const node = nodes[index];
      if (!node) return;

      const slug = service.slug?.current;
      if (slug) node.id = slug;

      text(node.querySelector('.service-button .num'), String(index + 1).padStart(2, '0'));
      text(node.querySelector('.service-button h2'), service.title);

      const body = node.querySelector('.service-content-inner p');
      text(body, service.valuePromise || service.whatWeBuild || service.shortDescription);

      const list = node.querySelector('.service-list');
      if (list && Array.isArray(service.deliverables)) {
        list.replaceChildren();
        service.deliverables.forEach((deliverable) => {
          const li = document.createElement('li');
          li.textContent = deliverable;
          list.append(li);
        });
      }
    });
  };

  const applyProcessSteps = (items) => {
    if (!Array.isArray(items)) return;
    const nodes = [...document.querySelectorAll('.process-grid .process-card')];

    items.forEach((item, index) => {
      const node = nodes[index];
      if (!node) return;
      text(node.querySelector('span'), item.number);
      text(node.querySelector('h3'), item.title);
      text(node.querySelector('p'), item.description);
    });
  };

  const applyDifferenceCards = (items) => {
    if (!Array.isArray(items)) return;
    const nodes = [...document.querySelectorAll('.difference-grid .difference-card')];

    items.forEach((item, index) => {
      const node = nodes[index];
      if (!node) return;
      text(node.querySelector('.difference-number'), item.number);
      text(node.querySelector('h3'), item.title);
      text(node.querySelector('p'), item.clientBenefit);
    });
  };

  const applyFaq = (items) => {
    if (!Array.isArray(items)) return;
    const nodes = [...document.querySelectorAll('.faq-list .faq-item')];

    items.forEach((item, index) => {
      const node = nodes[index];
      if (!node) return;
      text(node.querySelector('.faq-index'), String(index + 1).padStart(2, '0'));
      text(node.querySelector('.faq-question strong'), item.question);
      text(node.querySelector('.faq-answer p'), item.answer);
    });
  };

  const applySelectedClients = (clients) => {
    if (!Array.isArray(clients) || !clients.length) return;

    const rows = [...document.querySelectorAll('.client-wall .client-row')];
    if (!rows.length) return;

    const midpoint = Math.ceil(clients.length / 2);
    const groups = [clients.slice(0, midpoint), clients.slice(midpoint)];

    rows.forEach((row, rowIndex) => {
      const group = groups[rowIndex] || [];
      if (!group.length) return;

      const track = row.querySelector('.client-track');
      if (!track) return;

      const buildChip = (client, duplicate = false) => {
        const chip = document.createElement('div');
        chip.className = 'client-chip';
        if (!duplicate) chip.setAttribute('data-services-tilt', '');
        if (duplicate) chip.setAttribute('aria-hidden', 'true');

        if (client.legacyLogoPath) {
          const img = document.createElement('img');
          img.src = client.legacyLogoPath;
          img.alt = duplicate ? '' : (client.name || '');
          chip.append(img);
        } else {
          const span = document.createElement('span');
          span.className = 'client-name';
          span.textContent = client.name || '';
          chip.append(span);
        }

        return chip;
      };

      track.replaceChildren();
      group.forEach((client) => track.append(buildChip(client, false)));
      group.forEach((client) => track.append(buildChip(client, true)));
    });
  };

  const applyServices = (page, services) => {
    if (!page) return;

    const hero = document.querySelector('.page-hero');
    if (hero) {
      text(hero.querySelector('.kicker'), page.heroEyebrow);
      setHeadingWithBreaks(hero.querySelector('h1.display'), page.heroHeading);
      text(hero.querySelector('.lede'), page.heroClientValue);
    }

    applyServicePanels(services);

    const process = document.querySelector('.process-grid')?.closest('.section');
    if (process) {
      text(process.querySelector('.section-head .kicker'), page.processEyebrow);
      text(process.querySelector('.section-head .section-title'), page.processHeading);
      text(process.querySelector('.section-head .lede'), page.processIntro);
    }
    applyProcessSteps(page.processSteps);

    const experience = document.querySelector('.clients-experience');
    if (experience) {
      text(experience.querySelector('.clients-head .kicker'), page.experienceEyebrow);
      text(experience.querySelector('.clients-head .section-title'), page.experienceHeading);
      text(experience.querySelector('.clients-head .lede'), page.experienceCopy);
    }
    applySelectedClients(page.selectedClients);

    const difference = document.querySelector('.dv-difference');
    if (difference) {
      text(difference.querySelector('.difference-head .kicker'), page.differenceEyebrow);
      setHeadingWithBreaks(difference.querySelector('.difference-head .section-title'), page.differenceHeading);
      text(difference.querySelector('.difference-intro'), page.differenceIntro);
    }
    applyDifferenceCards(page.differenceCards);

    const faq = document.querySelector('.dv-faq');
    if (faq) {
      text(faq.querySelector('.faq-intro .kicker'), page.faqEyebrow);
      setHeadingWithBreaks(faq.querySelector('.faq-intro .section-title'), page.faqHeading);
      text(faq.querySelector('.faq-intro > p:not(.kicker)'), page.faqIntro);
    }
    applyFaq(page.faq);

    const closing = document.querySelector('.cta-band');
    if (closing) {
      text(closing.querySelector('h2'), page.closingMessage);
      const existingBody = closing.querySelector('.cta-copy p');
      if (existingBody) text(existingBody, page.closingBody);
      setButton(closing.querySelector('.btn'), page.closingCta);
    }
  };

  const loadContent = async () => {
    const query = pageId === 'servicesPage'
      ? `{"settings": *[_id == "siteSettings"][0], "page": *[_id == "servicesPage"][0]{..., selectedClients[]->{name,legacyLogoPath,displayOrder}}, "services": *[_type == "service"] | order(displayOrder asc){title,slug,shortDescription,valuePromise,whatWeBuild,deliverables,displayOrder}}`
      : `{"settings": *[_id == "siteSettings"][0], "page": *[_id == "${pageId}"][0]}`;
    const endpoint = new URL(
      `https://${config.projectId}.apicdn.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`
    );
    endpoint.searchParams.set('query', query);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(endpoint.toString(), {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
        headers: {Accept: 'application/json'},
      });

      if (!response.ok) {
        throw new Error(`Sanity request failed with HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (!payload?.result) throw new Error('Sanity returned no published content.');

      applyShared(payload.result.settings);
      applySeo(payload.result.page, payload.result.settings);

      if (pageId === 'homePage') applyHome(payload.result.page);\n      if (pageId === 'servicesPage') applyServices(payload.result.page, payload.result.services);

      document.documentElement.dataset.cms = 'sanity';
      window.dispatchEvent(new CustomEvent('dv:content-ready', {
        detail: {source: 'sanity', pageId},
      }));
    } catch (error) {
      document.documentElement.dataset.cms = 'static-fallback';
      console.warn('[Designing Virtuosity] Sanity content unavailable; using static fallback.', error);
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent, {once: true});
  } else {
    loadContent();
  }
})();