import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';

import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';
import PageRenderer from '~/core/pages/index';
import { Folder } from '~/core/components/pdf/folder';

export const loader: LoaderFunction = async ({ request, params }) => {
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(getHost(request));
    const shapeIdentifier = 'category';
    const renderer = PageRenderer.resolve(shapeIdentifier, request, params);
    const data = await renderer.fetchData(path, request, params);
    const { products, folder } = data;
    const pdf = await ReactPDF.renderToStream(<Folder folder={folder} products={products} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
