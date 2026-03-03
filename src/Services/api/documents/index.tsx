import {configureLayoutAnimationBatch} from 'react-native-reanimated/lib/typescript/core';
import {NetWorkService} from '../../apiNetworkServices';
import {getRoute} from '../routes';

/**
 * Network request used to get all docs list
 * @param
 * @returns success object
 */

const getDocumentsList = (data: any) => {
  return new Promise((resolve, reject) => {
    NetWorkService.Post({
      url:`documents/?page=${data?.page}&document_name=${data?.search}`,
      body: data,
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });
};

export {getDocumentsList};
