import type {StructureResolver} from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], title: string, schemaType: string, documentId: string) =>
  S.listItem()
    .title(title)
    .child(S.document().schemaType(schemaType).documentId(documentId).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Designing Virtuosity')
    .items([
      singleton(S, 'Site Settings', 'siteSettings', 'siteSettings'),
      S.divider(),
      singleton(S, 'Home Page', 'homePage', 'homePage'),
      singleton(S, 'Services Page', 'servicesPage', 'servicesPage'),
      singleton(S, 'Contact Page', 'contactPage', 'contactPage'),
      S.divider(),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('portfolioProject').title('Portfolio Projects'),
      S.documentTypeListItem('identityMark').title('Identity Archive'),
    ])
