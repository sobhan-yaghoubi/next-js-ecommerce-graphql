import { fetchGraphql } from "@/lib/graphql";
import {
  ProductPage2Document,
  ProductPage2Query,
  ProductPage2QueryVariables,
} from "@/lib/graphqlTypes";
import Image from "next/image";
import React from "react";

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
    </div>
  );
};

export default ProductPage;
