import { DocumentNode, print } from "graphql"
import { ensureStartWith } from "./utils"

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}
const endpoint = ensureStartWith(
  `${process.env.NEXT_PUBLIC_MAGENTO_STORE_DOMAIN}${process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT}`,
  "https://"
)

export const fetchGraphql = async <T, G = null>(
  query: string | DocumentNode,
  options: RequestInit & {
    next?: { revalidate?: number }
    variables?: Record<string, any> | G
  } = {}
): Promise<{ status: number; data: T }> => {
  try {
    const queryString = typeof query === "string" ? query : print(query)
    console.log(
      "DDDDDD",
      JSON.stringify({
        queryString,
        ...(options.variables && options.variables),
      })
    )
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify({
        queryString,
        ...(options.variables && options.variables),
      }),
      next: options.next || { revalidate: 60 }, // For ISR Request
    })

    const result: GraphQLResponse<T> = await response.json()
    if (result.errors) {
      throw new Error(`Graphql Error : ${JSON.stringify(result.errors)}`)
    }

    if (!result.data) {
      throw new Error(`No Date returned from Graphql`)
    }

    return { status: response.status, data: result.data }
  } catch (error) {
    console.warn(JSON.stringify(error))
    throw {
      error,
      query,
    }
  }
}
