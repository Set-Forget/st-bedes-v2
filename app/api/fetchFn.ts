export const basicFetch = async <returnType>(
  endpoint: string
): Promise<returnType> => {
  const response = await fetch(endpoint);

  if (!response.ok) throw Error("Something went wrong.");
  const data = await response.json();

  return data;
};