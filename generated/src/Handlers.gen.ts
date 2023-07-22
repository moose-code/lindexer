/* TypeScript file generated from Handlers.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
const Curry = require('rescript/lib/js/curry.js');

// @ts-ignore: Implicit any on import
const HandlersBS = require('./Handlers.bs');

import type {ERC721Contract_TransferEvent_context as Types_ERC721Contract_TransferEvent_context} from './Types.gen';

import type {ERC721Contract_TransferEvent_eventArgs as Types_ERC721Contract_TransferEvent_eventArgs} from './Types.gen';

import type {ERC721Contract_TransferEvent_loaderContext as Types_ERC721Contract_TransferEvent_loaderContext} from './Types.gen';

import type {eventLog as Types_eventLog} from './Types.gen';

export const ERC721Contract_Transfer_loader: (userLoader:((_1:{ readonly event: Types_eventLog<Types_ERC721Contract_TransferEvent_eventArgs>; readonly context: Types_ERC721Contract_TransferEvent_loaderContext }) => void)) => void = function (Arg1: any) {
  const result = HandlersBS.ERC721Contract.Transfer.loader(function (Argevent: any, Argcontext: any) {
      const result1 = Arg1({event:Argevent, context:{contractRegistration:Argcontext.contractRegistration, nftcollection:Argcontext.nftcollection, token:{existingTransferredTokenLoad:function (Arg11: any, Arg2: any) {
          const result2 = Curry._2(Argcontext.token.existingTransferredTokenLoad, Arg11, Arg2.loaders);
          return result2
        }}}});
      return result1
    });
  return result
};

export const ERC721Contract_Transfer_handler: (userHandler:((_1:{ readonly event: Types_eventLog<Types_ERC721Contract_TransferEvent_eventArgs>; readonly context: Types_ERC721Contract_TransferEvent_context }) => void)) => void = function (Arg1: any) {
  const result = HandlersBS.ERC721Contract.Transfer.handler(function (Argevent: any, Argcontext: any) {
      const result1 = Arg1({event:Argevent, context:{log:{debug:Argcontext.log.debug, info:Argcontext.log.info, warn:Argcontext.log.warn, error:Argcontext.log.error, errorWithExn:function (Arg11: any, Arg2: any) {
          const result2 = Curry._2(Argcontext.log.errorWithExn, Arg11, Arg2);
          return result2
        }}, nftcollection:Argcontext.nftcollection, user:Argcontext.user, token:Argcontext.token}});
      return result1
    });
  return result
};
