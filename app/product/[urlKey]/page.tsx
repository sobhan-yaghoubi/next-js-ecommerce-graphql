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
    <div className="container mx-auto mt-20 flex flex-col items-center gap-10">
      {product?.image?.url ? (
        <Image
          src={product?.image?.url}
          width={600}
          height={600}
          alt={product?.image?.label ?? ""}
        />
      ) : null}
      <h1 className="text-7xl">{product?.name}</h1>
      <p>
        <span>تومان</span>{" "}
        <span>
          {product?.price_range.maximum_price?.final_price.value?.toLocaleString(
            "en-US",
          )}
        </span>
      </p>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-10">
        {relatedProducts?.map((relatedProducts) => (
          <div
            className="center col-span-1 flex-col gap-5 rounded-md border-2 p-5 text-center"
            key={relatedProducts?.uid}
          >
            {relatedProducts?.image?.url ? (
              <Image
                src={relatedProducts?.image?.url}
                width={150}
                height={150}
                className="h-36 w-auto"
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
