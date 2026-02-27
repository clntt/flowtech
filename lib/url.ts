import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const formUrlquery = ({ params, key, value }: UrlQueryParams) => {
  const queryString = qs.parse(params);
  if (!value) {
    delete queryString[key];
  } else {
    queryString[key] = value;
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    {
      skipNull: true,
      skipEmptyString: true,
    }
  );
};

export const removeKeysFromUrlquery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true }
  );
};
