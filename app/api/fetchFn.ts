// export const basicFetch = async <returnType>(
//   endpoint: string
// ): Promise<returnType> => {
//   const response = await fetch(endpoint);

//   if (!response.ok) throw Error("Something went wrong.");
//   const data = await response.json();

//   return data;
// };

export const basicFetch = async <returnType>(
  endpoint: string
): Promise<returnType> => {
  const headers = new Headers();
  headers.append("ngrok-skip-browser-warning", "true");

  const response = await fetch(endpoint, {
    method: 'GET', 
    headers: headers
  });

  if (!response.ok) {
    console.error(`Fetch Error: ${response.status} ${response.statusText}`);
    throw new Error(`Fetch Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
