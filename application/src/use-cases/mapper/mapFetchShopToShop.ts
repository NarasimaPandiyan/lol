import { ProductSlim } from '~/core/contracts/Product';
import { Shop } from '~/core/contracts/Shop';
import {
    choiceComponentWithId,
    stringForRichTextComponentWithId,
    stringForSingleLineComponentWithId,
} from '~/lib/api-mappers';
import { createGrid } from '~/lib/grid-tile/createGrid';
import mapAPIMetaSEOComponentToSEO from './mapAPIMetaSEOComponentToSEO';
import mapAPIProductVariantToProductVariant from './mapAPIProductVariantToProductVariant';

export default (data: any): Shop => {
    const [folder, hierarchy] = data;

    const hero = choiceComponentWithId(data.components, 'hero-content');
    const grid = hero?.content?.grids?.[0] || (hero?.content?.items ? createGrid(hero?.content?.items) : null);

    const firstSeoChunk = folder.meta.content.chunks[0];
    const dto: Shop = {
        name: folder.name,
        title: stringForSingleLineComponentWithId(folder.components, 'title') || data.name!,
        path: folder.path,
        description: stringForRichTextComponentWithId(folder.components, 'description') || data.name!,
        hero: grid
            ? {
                  id: `grid-${hero?.id ?? folder.id}`,
                  ...grid,
              }
            : undefined,
        seo: mapAPIMetaSEOComponentToSEO(firstSeoChunk),
        categories: hierarchy.tree.children.map((child: any) => {
            return {
                name: child.name,
                path: child.path,
                description: child.description?.content,
                products: child.children.map((product: any): ProductSlim => {
                    return {
                        id: product.id,
                        name: product.name,
                        path: product.path,
                        variant: mapAPIProductVariantToProductVariant(product.defaultVariant),
                        topics: [],
                    };
                }),
            };
        }),
    };
    return dto;
};
