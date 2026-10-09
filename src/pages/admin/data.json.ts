import { getAdminData } from '../../lib/admin-data';

export async function GET() {
  return new Response(JSON.stringify(await getAdminData()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
