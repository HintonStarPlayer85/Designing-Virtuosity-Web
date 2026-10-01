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

  const setHeadingPreservingBreak = (node, value) => {
    if (!node || !value) return;

    const br = node.querySelector('br');
    if (!br) {
      node.textContent = value;
      return;
    }

    let firstLine = '';
    for (const child of node.childNodes) {
      if (child === br) break;
      firstLine += child.textContent || '';
    }

    const firstLineWords = firstLine.trim().split(/\s+/).filter(Boolean).length || 1;
    const words = String(value).trim().split(/\s+/).filter(Boolean);

    if (words.length <= 1) {
      node.textContent = value;
      return;
    }

    const splitAt = Math.min(firstLineWords, words.length - 1);
    node.replaceChildren(
      document.createTextNode(words.slice(0, splitAt).join(' ')),
      document.createElement('br'),
      document.createTextNode(words.slice(splitAt).join(' '))
    );
  };

  const setDisplayHeading = (node, top, accent) => {
    if (!node) return;

    const accentNode = node.querySelector('.gradient-word') || document.createElement('span');
    accentNode.classList.add('gradient-word');
    if (accent) accentNode.textContent = accent;

    node.replaceChildren(
      document.createTextNode(top || ''),
      document.createElement('br'),
      accentNode
    );
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


  const portfolioLevelLabel = (value) => ({
    featured: 'Featured Project',
    caseStudy: 'Case Study',
    artifact: 'Portfolio Artifact',
  }[value] || 'Portfolio Artifact');

  const normalizeKey = (value = '') => String(value).trim().toLowerCase();

  const projectTreatment = (project) => {
    const parts = [];
    if (project?.challenge) parts.push(`Challenge: ${project.challenge}`);
    if (project?.strategy) parts.push(`Approach: ${project.strategy}`);
    if (project?.designSystem) parts.push(`Solution: ${project.designSystem}`);
    return parts.join(' ') || project?.portfolioTreatment || '';
  };

  const syncCaseDataset = (node, project, slugOverride) => {
    if (!node || !project) return;

    node.dataset.caseTitle = project.title || node.dataset.caseTitle || '';
    node.dataset.caseLevel = portfolioLevelLabel(project.portfolioLevel);
    node.dataset.caseDiscipline = project.discipline || project.cardCategoryLabel || '';
    node.dataset.caseSummary = project.summary || project.cardCopy || '';
    node.dataset.caseDeliverables = Array.isArray(project.deliverables)
      ? project.deliverables.join(' · ')
      : '';
    node.dataset.caseTreatment = projectTreatment(project);

    if (project.website) node.dataset.caseUrl = project.website;
    else delete node.dataset.caseUrl;

    if (project.legacyAccent) node.dataset.caseAccent = project.legacyAccent;

    const slug = slugOverride || project.slug?.current;
    if (slug) node.dataset.caseSlug = slug;
  };

  const applyProjectCover = (node, project, selector) => {
    if (!node || !project?.coverImageUrl) return;
    const visual = node.querySelector(selector);
    if (!visual) return;

    visual.style.backgroundImage = `url("${String(project.coverImageUrl).replace(/"/g, '%22')}")`;
    visual.style.backgroundSize = 'cover';
    visual.style.backgroundPosition = 'center';
    visual.style.backgroundRepeat = 'no-repeat';

    [...visual.children].forEach((child) => {
      child.style.opacity = '0';
      child.setAttribute('aria-hidden', 'true');
    });
  };

  const applyFeaturedProjects = (projects) => {
    const reel = document.querySelector('.feature-reel');
    if (!reel || !Array.isArray(projects)) return;

    const nodes = [...reel.querySelectorAll('.feature-project')];
    const byTitle = new Map(nodes.map((node) => [normalizeKey(node.dataset.caseTitle), node]));
    const used = new Set();

    const featured = projects
      .filter((project) => project.featured)
      .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));

    featured.forEach((project, index) => {
      const node = byTitle.get(normalizeKey(project.title)) || nodes[index];
      if (!node || used.has(node)) return;
      used.add(node);

      syncCaseDataset(node, project);

      const level = project.portfolioLevel === 'caseStudy'
        ? 'Featured Case Study'
        : portfolioLevelLabel(project.portfolioLevel);

      text(node.querySelector('.feature-number'), `${String(index + 1).padStart(2, '0')} · ${level}`);
      text(node.querySelector('.feature-copy .kicker'), project.cardCategoryLabel || project.discipline);
      text(node.querySelector('.feature-copy h3'), project.title);
      text(node.querySelector('.feature-copy p'), project.cardCopy || project.summary);
      applyProjectCover(node, project, '.feature-visual');

      node.hidden = false;
      reel.append(node);
    });

    nodes.forEach((node) => {
      if (!used.has(node)) node.hidden = true;
    });
  };

  const applyPortfolioIndex = (projects) => {
    const grid = document.querySelector('.work-index-section .work-grid');
    if (!grid || !Array.isArray(projects)) return;

    const nodes = [...grid.querySelectorAll('.work-item')];
    const byTitle = new Map(nodes.map((node) => [normalizeKey(node.dataset.caseTitle), node]));
    const used = new Set();

    const ordered = [...projects].sort(
      (a, b) => (a.portfolioOrder ?? 999) - (b.portfolioOrder ?? 999)
    );

    ordered.forEach((project, index) => {
      const node = byTitle.get(normalizeKey(project.title)) || nodes[index];
      if (!node || used.has(node)) return;
      used.add(node);

      syncCaseDataset(node, project, `${project.slug?.current || 'project'}-index`);
      text(node.querySelector('.work-item-copy > span'), project.cardCategoryLabel || project.discipline);
      text(node.querySelector('.work-item-copy h3'), project.title);
      applyProjectCover(node, project, '.work-item-visual');

      node.hidden = false;
      grid.append(node);
    });

    nodes.forEach((node) => {
      if (!used.has(node)) node.hidden = true;
    });
  };

  const applyIdentityMarks = (marks) => {
    const mosaic = document.querySelector('.identity-mosaic');
    if (!mosaic || !Array.isArray(marks)) return;

    const nodes = [...mosaic.querySelectorAll('.identity-tile')];
    const byTitle = new Map(nodes.map((node) => [normalizeKey(node.dataset.caseTitle), node]));
    const used = new Set();

    const ordered = [...marks].sort(
      (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
    );

    ordered.forEach((mark, index) => {
      const node = byTitle.get(normalizeKey(mark.organizationName)) || nodes[index];
      if (!node || used.has(node)) return;
      used.add(node);

      const project = mark.relatedProject || {
        title: mark.organizationName,
        slug: mark.slug,
        portfolioLevel: mark.projectType === 'Expanded Brand Project' ? 'featured' : 'artifact',
        discipline: 'Brand Identity',
        summary: mark.description,
        portfolioTreatment: mark.portfolioTreatment,
        deliverables: ['Brand identity'],
      };

      syncCaseDataset(node, project, `identity-${mark.slug?.current || index + 1}`);
      text(node.querySelector('.identity-caption strong'), mark.organizationName);
      text(node.querySelector('.identity-caption > span'), mark.projectType || 'Brand Identity');

      const logo = node.querySelector('.identity-mark');
      if (logo) {
        [...logo.classList]
          .filter((className) => className.startsWith('logo-'))
          .forEach((className) => logo.classList.remove(className));

        if (mark.logoUrl) {
          logo.style.backgroundImage = `url("${String(mark.logoUrl).replace(/"/g, '%22')}")`;
          logo.style.backgroundSize = 'contain';
          logo.style.backgroundPosition = 'center';
          logo.style.backgroundRepeat = 'no-repeat';
        } else if (mark.legacyLogoClass) {
          logo.style.removeProperty('background-image');
          logo.style.removeProperty('background-size');
          logo.style.removeProperty('background-position');
          logo.style.removeProperty('background-repeat');
          logo.classList.add(mark.legacyLogoClass);
        }
      }

      node.hidden = false;
      mosaic.append(node);
    });

    nodes.forEach((node) => {
      if (!used.has(node)) node.hidden = true;
    });
  };

  const applyPortfolio = (page, projects, identities) => {
    if (!page) return;

    const hero = document.querySelector('.page-hero');
    if (hero) {
      text(hero.querySelector('.kicker'), page.heroEyebrow);
      setDisplayHeading(hero.querySelector('h1.display'), page.heroHeadingTop, page.heroHeadingAccent);
      text(hero.querySelector('.lede'), page.heroIntro);
    }

    const featured = document.querySelector('.wow-featured');
    if (featured) {
      text(featured.querySelector('.portfolio-intro-grid .kicker'), page.featuredEyebrow);
      setHeadingPreservingBreak(featured.querySelector('.portfolio-intro-grid .section-title'), page.featuredHeading);
      text(featured.querySelector('.portfolio-intro-grid .lede'), page.featuredIntro);
    }

    const index = document.querySelector('.work-index-section');
    if (index) {
      text(index.querySelector('.work-index-head .kicker'), page.indexEyebrow);
      setHeadingPreservingBreak(index.querySelector('.work-index-head .section-title'), page.indexHeading);
      text(index.querySelector('.work-index-head .lede'), page.indexIntro);
    }

    const identity = document.querySelector('.identity-archive');
    if (identity) {
      text(identity.querySelector('.identity-head .kicker'), page.identityEyebrow);
      setHeadingPreservingBreak(identity.querySelector('.identity-head .section-title'), page.identityHeading);
      text(identity.querySelector('.identity-head .lede'), page.identityIntro);
    }

    const range = document.querySelector('.design-range');
    if (range) {
      setHeadingPreservingBreak(range.querySelector('.range-head .section-title'), page.rangeHeading);
      text(range.querySelector('.range-head p'), page.rangeIntro);
    }

    applyFeaturedProjects(projects);
    applyPortfolioIndex(projects);
    applyIdentityMarks(identities);

    const modalHeadings = [...document.querySelectorAll('.case-modal .case-copy h3')];
    text(modalHeadings[0], 'Project context');
    text(modalHeadings[1], 'Challenge, approach and solution');
    text(
      '.case-modal .case-note',
      'Projects are presented at the depth supported by approved assets and documented project evidence.'
    );

    const closing = document.querySelector('.cta-band');
    if (closing) {
      text(closing.querySelector('h2'), page.closingHeading);

      let body = closing.querySelector('.cta-copy p');
      if (!body && page.closingBody) {
        const heading = closing.querySelector('h2');
        if (heading) {
          body = document.createElement('p');
          heading.insertAdjacentElement('afterend', body);
        }
      }
      text(body, page.closingBody);
      setButton(closing.querySelector('.btn'), page.closingCta);
    }
  };


  const replaceMetaValue = (node, value) => {
    if (!node || value === undefined || value === null || value === '') return;
    const label = node.querySelector('span');
    if (!label) {
      node.textContent = value;
      return;
    }
    node.replaceChildren(label, document.createTextNode(String(value)));
  };

  const optionId = (value, index) => {
    const slug = String(value || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `project-type-${slug || index + 1}`;
  };

  const applyProjectTypeOptions = (items) => {
    if (!Array.isArray(items) || !items.length) return;
    const grid = document.querySelector('#project-form .option-grid');
    if (!grid) return;

    grid.replaceChildren();
    items.forEach((label, index) => {
      const chip = document.createElement('div');
      chip.className = 'option-chip';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'project_type';
      input.id = optionId(label, index);
      input.value = label;
      if (index === 0) input.required = true;

      const labelNode = document.createElement('label');
      labelNode.htmlFor = input.id;
      labelNode.textContent = label;

      chip.append(input, labelNode);
      grid.append(chip);
    });
  };

  const replaceSelectOptions = (select, items) => {
    if (!select || !Array.isArray(items) || !items.length) return;

    const placeholder = select.querySelector('option[value=""]')?.textContent || 'Select an option';
    select.replaceChildren();

    const first = document.createElement('option');
    first.value = '';
    first.textContent = placeholder;
    select.append(first);

    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.append(option);
    });
  };

  const applySourceOptions = (items) => {
    if (!Array.isArray(items) || !items.length) return;
    const input = document.querySelector('#project-form input[name="source"]');
    if (!input) return;

    let list = document.querySelector('#dv-source-options');
    if (!list) {
      list = document.createElement('datalist');
      list.id = 'dv-source-options';
      document.body.append(list);
    }

    list.replaceChildren();
    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      list.append(option);
    });
    input.setAttribute('list', list.id);
  };

  const applyFormFields = (fields) => {
    if (!Array.isArray(fields)) return;

    fields.forEach((field) => {
      if (!field?.name || field.name === 'project_type') return;

      const control = document.querySelector(
        `#project-form [name="${CSS.escape(field.name)}"]`
      );
      if (!control) return;

      const id = control.id;
      if (id) text(document.querySelector(`label[for="${CSS.escape(id)}"]`), field.label);

      if ('placeholder' in control && field.placeholder !== undefined && field.placeholder !== null) {
        control.placeholder = field.placeholder;
      }

      // Required-state changes are allowed only for the existing visible fields.
      // Field names, input types and endpoint/payload mechanics remain code-controlled.
      if (typeof field.required === 'boolean') control.required = field.required;
    });
  };

  const applyContact = (page) => {
    if (!page) return;

    const hero = document.querySelector('.page-hero');
    if (hero) {
      text(hero.querySelector('.kicker'), page.heroEyebrow);
      setDisplayHeading(hero.querySelector('h1.display'), page.heroHeadingTop, page.heroHeadingAccent);
      text(hero.querySelector('.lede'), page.heroIntro);
    }

    const inquiry = document.querySelector('.contact-aside');
    if (inquiry) {
      text(inquiry.querySelector('.kicker'), page.inquiryEyebrow);
      text(inquiry.querySelector('.section-title'), page.inquiryHeading);
      text(inquiry.querySelector(':scope > p:not(.kicker)'), page.inquiryCopy);

      const meta = [...inquiry.querySelectorAll('.contact-meta > div')];
      replaceMetaValue(meta[0], page.studioLabel);
      replaceMetaValue(meta[1], page.establishedLabel);
      replaceMetaValue(meta[2], page.projectTypesSummary);
    }

    applyProjectTypeOptions(page.projectTypes);
    applyFormFields(page.formFields);
    replaceSelectOptions(document.querySelector('#budget'), page.budgetOptions);
    replaceSelectOptions(document.querySelector('#timeline'), page.timelineOptions);
    applySourceOptions(page.sourceOptions);

    const form = document.querySelector('#project-form');
    if (form) {
      const submit = form.querySelector('button[type="submit"]');
      if (submit && page.submitLabel) {
        const arrow = submit.querySelector('.btn-arrow');
        if (arrow) submit.replaceChildren(document.createTextNode(`${page.submitLabel} `), arrow);
        else submit.textContent = page.submitLabel;
      }

      text(form.querySelector('.form-note'), page.formNote);

      if (page.successMessage) form.dataset.successMessage = page.successMessage;
      if (page.errorMessage) form.dataset.errorMessage = page.errorMessage;
    }

    const referral = document.querySelector('.strategic-intelligence');
    if (referral) {
      text(referral.querySelector('.kicker'), page.referralEyebrow);
      text(referral.querySelector('h2'), page.referralHeading);
      text(referral.querySelector('.intelligence-card > div > p:not(.kicker)'), page.referralCopy);

      const link = referral.querySelector('.intelligence-link');
      if (link) {
        text(link.querySelector('strong'), page.referralLabel);
        href(link, page.referralUrl);
      }
    }
  };

  const loadContent = async () => {
    const query = pageId === 'servicesPage'
      ? `{"settings": *[_id == "siteSettings"][0], "page": *[_id == "servicesPage"][0]{..., selectedClients[]->{name,legacyLogoPath,displayOrder}}, "services": *[_type == "service"] | order(displayOrder asc){title,slug,shortDescription,valuePromise,whatWeBuild,deliverables,displayOrder}}`
      : pageId === 'portfolioPage'
        ? `{"settings": *[_id == "siteSettings"][0], "page": *[_id == "portfolioPage"][0], "projects": *[_type == "portfolioProject"] | order(coalesce(featuredOrder,999) asc, coalesce(portfolioOrder,999) asc){title,slug,discipline,cardCategoryLabel,cardCopy,portfolioLevel,summary,challenge,strategy,designSystem,portfolioTreatment,deliverables,website,legacyAccent,featured,featuredOrder,portfolioOrder,"coverImageUrl":coverImage.asset->url}, "identities": *[_type == "identityMark" && featured != false] | order(displayOrder asc){organizationName,slug,projectType,description,portfolioTreatment,legacyLogoClass,legacyAssetPath,displayOrder,"logoUrl":logo.asset->url,"relatedProject":relatedProject->{title,slug,discipline,cardCategoryLabel,cardCopy,portfolioLevel,summary,challenge,strategy,designSystem,portfolioTreatment,deliverables,website,legacyAccent}}}`
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

      if (pageId === 'homePage') applyHome(payload.result.page);
      if (pageId === 'servicesPage') applyServices(payload.result.page, payload.result.services);
      if (pageId === 'portfolioPage') applyPortfolio(payload.result.page, payload.result.projects, payload.result.identities);
      if (pageId === 'contactPage') applyContact(payload.result.page);

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