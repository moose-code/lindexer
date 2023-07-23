import React, { useState } from "react";
import HyperLink from "./Hyperlink";

type TableRowProps = {
  title: string;
  value: React.ReactNode;
};
const TableRow = ({ title, value }: TableRowProps) => (
  <tr className="align-top">
    <td className="w-28 py-4">{title}</td>
    <td className="py-4">{value}</td>
  </tr>
);

type Attribute = {
  trait_type: string;
  value: string;
};

export type Token = {
  tokenId: number;
  name: string;
  owner: string;
  collection: string;
  description: string;
  imageUrl: string;
  attributes: Attribute[];
};

type NftModalProps = {
  showModal: boolean;
  setShowModal: (b: boolean) => void;
  token: Token;
};

const NftModal = ({ showModal, setShowModal, token }: NftModalProps) => {
  const {
    tokenId,
    name,
    owner,
    collection,
    description,
    imageUrl,
    attributes,
  } = token;

  return (
    <>
      {showModal && (
        <>
          <div className=" text-white flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-[70%]">
              <div className="rounded-xl shadow-lg relative flex flex-col w-full bg-gray-900 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 rounded-t absolute top-0 right-0">
                  <button
                    className="bg-transparent  text-white float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-white flex justify-center items-center opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="flex  w-full">
                  <img
                    src={imageUrl}
                    className="object-cover rounded-l-xl w-2/3"
                  />
                  <div className="flex flex-col justify-center p-4 max-w-[40%]">
                    <table>
                      <TableRow title="ID:" value={`#${tokenId}`} />
                      <TableRow title="Name:" value={name} />
                      <TableRow
                        title="Collection:"
                        value={
                          <HyperLink
                            href={`https://lineascan.build/address/${collection}`}
                            openInNewTab
                          >
                            {collection}
                          </HyperLink>
                        }
                      />
                      <TableRow
                        title="Owner:"
                        value={
                          <HyperLink
                            href={`https://lineascan.build/address/${owner}`}
                            openInNewTab
                          >
                            {owner}
                          </HyperLink>
                        }
                      />
                      <TableRow title="Description:" value={description} />
                      <TableRow
                        title="attributes:"
                        value={
                          <div className="flex flex-wrap gap-3">
                            {attributes.map((attribute, i) => (
                              <div
                                key={i}
                                className="bg-gray-600 rounded-lg p-3"
                              >
                                <p className="uppercase font-bold text-sm">
                                  {attribute.trait_type}
                                </p>
                                <p className="text-lg mt-2">
                                  {attribute.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        }
                      />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NftModal;
