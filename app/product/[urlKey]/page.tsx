import { fetchGraphql } from "@/lib/graphql";
import {
  CategoryProductsDocument,
  CategoryProductsQuery,
  CategoryProductsQueryVariables,
  ProductPage2Document,
  ProductPage2Query,
  ProductPage2QueryVariables,
} from "@/lib/graphqlTypes";
import Image from "next/image";
import React from "react";

export const generateStaticParams = async () => {
  const data = await fetchGraphql<
    CategoryProductsQuery,
    CategoryProductsQueryVariables
  >(CategoryProductsDocument, {
    variables: { categoryId: "2", pageSize: 10000 },
  });

  const products = data.data.products?.items ?? [];

  return products.map((product) => ({ urlKey: product?.url_key }));
};

const ProductPage = async ({
  params,
}: {
  params: Promise<{ urlKey: string }>;
}) => {
  const { urlKey } = await params;
  const data = await fetchGraphql<
    ProductPage2Query,
    ProductPage2QueryVariables
  >(ProductPage2Document, { variables: { urlKey } });
  const product = data.data.products?.items?.at(0);
  const relatedProducts = product?.related_products;
  return (
    <div className="flex flex-col items-center">
      {product?.image?.url ? (
        <Image
          src={product?.image?.url}
          width={600}
          height={600}
          alt={product?.image?.label ?? ""}
        />
      ) : null}
      <h1 className="text-7xl">{product?.name}</h1>
      <p>{JSON.stringify(product?.short_description?.html)}</p>
      <p>{product?.price_range.maximum_price?.final_price.value}</p>

      <div className="flex items-center gap-10">
        {relatedProducts?.map((relatedProducts) => (
          <div
            className="flex flex-col items-center justify-center"
            key={relatedProducts?.uid}
          >
            {relatedProducts?.image?.url ? (
              <Image
                src={relatedProducts?.image?.url}
                width={150}
                height={150}
                alt={`Image-${relatedProducts.uid}`}
              />
            ) : null}
            <p>{relatedProducts?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
