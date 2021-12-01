import { Client } from '@gadget-client/envoy'

let client: Client

export function getClient() {
  if (!client)
    client = new Client({
      authenticationMode: {
        browserSession: true,
      },
    })

  return client
}
