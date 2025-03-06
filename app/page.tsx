import { fetchGraphql } from "@/lib/graphql";
import {
  CategoryProductsDocument,
  CategoryProductsQuery,
  CategoryProductsQueryVariables,
} from "@/lib/graphqlTypes";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await fetchGraphql<
    CategoryProductsQuery,
    CategoryProductsQueryVariables
  >(CategoryProductsDocument, { variables: { categoryId: "43" } });

  return (
    <>
      <h1 className="mx-auto mb-4 text-center text-5xl">Product List</h1>
      <div className="@container mx-auto grid w-full grid-cols-[repeat(auto-fill,minmax(350px,1fr))] px-40">
        {data.data.products?.items?.map((product) => (
          <div className="group p-3" key={product?.uid}>
            <div className="overflow-hidden rounded-sm border-2 border-solid border-gray-400 text-center">
              <Link href={`/product/${product?.url_key}`}>
                {product?.thumbnail?.url ? (
                  <div className="flex items-center justify-center bg-white">
                    <Image
                      src={product?.thumbnail?.url}
                      width={300}
                      height={300}
                      className="h-72 w-auto max-w-fit object-contain transition-all duration-150 group-hover:p-3"
                      alt={product?.image?.url ?? ""}
                    />
                  </div>
                ) : null}
                <span className="inline-block py-4">{product?.name}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
