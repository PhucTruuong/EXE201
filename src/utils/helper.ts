// src/utils/helpers.ts

export const parseSortParam = (sort: string): [string, 'ASC' | 'DESC'][] => {
    return sort.split(',').map(prop => {
      if (prop.startsWith('-')) {
        return [prop.substr(1), 'DESC'];
      }
      return [prop, 'ASC'];
    });
  };
  