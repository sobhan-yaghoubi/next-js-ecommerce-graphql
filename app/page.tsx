import { fetchGraphql } from "@/lib/graphql"
import {
  ProductPage2Document,
  ProductPage2Query,
  ProductPage2QueryVariables,
} from "@/lib/graphql-types"
import Image from "next/image"

export default async function Home() {
  const data = await fetchGraphql<
    ProductPage2Query,
    ProductPage2QueryVariables
  >(ProductPage2Document, { variables: { urlKey: "dk-1-13602" } })

  return (
    <>
      {data.data.products?.items?.map((product) => (
        <div key={product?.uid}>
          {product?.thumbnail?.url ? (
            <Image
              src={product?.thumbnail?.url}
              width={300}
              height={300}
              alt={product?.image?.url ?? ""}
            />
          ) : null}
          <span>{product?.name}</span>
        </div>
      ))}
    </>
  )
}
