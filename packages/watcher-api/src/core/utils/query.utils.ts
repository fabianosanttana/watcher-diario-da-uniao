import { CreateListenerDto } from 'src/dtos/create.listener.dto';

const serializeObjectToQueryString = (obj: any): string => {
  return Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .map((key) => key + '=' + obj[key])
    .join('&');
};

export const bindListenerUrl = (listenerDto: CreateListenerDto): string => {
  const { query, actType, mainOrganization, subOrganization, url } =
    listenerDto;
  if (url) return url;
  const baseUrl = 'https://www.in.gov.br/consulta/-/buscar/dou?';
  const params = serializeObjectToQueryString({
    q: query,
    s: 'do1',
    exactDate: 'all',
    sortType: 0,
    artType: actType,
    orgPrin: mainOrganization,
    orgSub: subOrganization,
    delta: 100,
  });

  return baseUrl + params;
};
