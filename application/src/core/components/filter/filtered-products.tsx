import { useState } from 'react';
import { Product } from '~/core/components/item/product';
export const FilteredProducts = ({ products }: { products: any }) => {
    let [checked, setChecked] = useState(true);
    let defaultVariants = products.filter((product: any) => product?.node?.matchingVariant?.isDefault === true);
    products = checked ? products : defaultVariants;

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center">
                <h2 className="font-medium text-md my-5">Found {products.length} products</h2>
                {products.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-md my-5">Show variants</span>
                        <label className="relative inline-block w-[46px] h-[24px]">
                            <input
                                type="checkbox"
                                className="opacity-0 h-0 w-0"
                                onChange={(e) => setChecked(e.target.checked)}
                                defaultChecked={checked}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product: any, index: number) => {
                    return (
                        <Product
                            key={index}
                            item={{
                                ...product.node,
                                defaultVariant: {
                                    ...product.node.matchingVariant,
                                    firstImage: product.node.matchingVariant.images?.[0],
                                },
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};