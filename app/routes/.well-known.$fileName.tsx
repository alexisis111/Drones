import { json } from "react-router";

// This route handles requests to /.well-known/* paths
// Specifically addresses the Chrome DevTools manifest request
export async function loader({ params }: { params: { fileName: string } }) {
  // For Chrome DevTools manifest or any other well-known files that don't exist
  // Return a 404 response instead of letting it bubble up as an error
  if (params.fileName.includes('com.chrome.devtools')) {
    return json(
      { error: 'Not Found' },
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // For other well-known files that might be requested
  return json(
    { error: 'Not Found' },
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}