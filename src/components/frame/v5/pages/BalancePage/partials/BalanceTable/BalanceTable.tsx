import {
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import React, { FC, useState } from 'react';

import {
  useColonyContext,
  useGetSelectedDomainFilter,
  useMobile,
} from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import useToggle from '~hooks/useToggle';
import { formatText } from '~utils/intl';
// import { useSearchContext } from '~context/SearchContext';
// import Filter from '~v5/common/Filter';
import EmptyContent from '~v5/common/EmptyContent';
import TableWithHeaderAndMeatballMenu from '~v5/common/TableWithHeaderAndMeatballMenu';
import Button from '~v5/shared/Button';
import CopyWallet from '~v5/shared/CopyWallet';

import BalanceModal from '../BalanceModal';

import { useBalanceTableColumns, useGetTableMenuProps } from './hooks';
import { BalanceTableFieldModel, BalanceTableProps } from './types';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable';

const BalanceTable: FC<BalanceTableProps> = ({ data }) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const {
    colony: { balances, nativeToken, status, colonyAddress },
  } = useColonyContext();
  const { nativeToken: nativeTokenStatus } = status || {};
  const isMobile = useMobile();
  // const { searchValue } = useSearchContext();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const tokensDataLength = data?.length;

  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const columns = useBalanceTableColumns(
    nativeToken,
    balances,
    nativeTokenStatus,
    Number(selectedDomain?.nativeId) || undefined,
  );
  const { getMenuProps } = useGetTableMenuProps(
    data,
    toggleAddFundsModalOn,
    nativeTokenStatus,
    nativeToken,
  );

  return (
    <>
      <TableWithHeaderAndMeatballMenu<BalanceTableFieldModel>
        title={formatText({ id: 'balancePage.table.title' })}
        verticalOnMobile={false}
        hasPagination
        getRowId={({ token }) => (token ? token.tokenAddress : uniqueId())}
        columns={columns}
        data={data || []}
        state={{
          sorting,
          rowSelection,
          columnVisibility: {
            symbol: !isMobile,
            type: !isMobile,
          },
        }}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        showPageNumber={data.length >= 10}
        onSortingChange={setSorting}
        onRowSelectionChange={setRowSelection}
        getSortedRowModel={getSortedRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
        emptyContent={
          !tokensDataLength && (
            <div className="border border-1 w-full rounded-b-lg border-gray-200">
              <EmptyContent
                icon="binoculars"
                title={{ id: 'balancePage.table.emptyTitle' }}
                description={{ id: 'balancePage.table.emptyDescription' }}
                withoutButtonIcon
              />
            </div>
          )
        }
        getMenuProps={getMenuProps}
        renderCellWrapper={(className, content) => (
          <div className={clsx(className, 'min-h-[3.625rem] !py-[0.1rem]')}>
            {content}
          </div>
        )}
      >
        <>
          {/* # TODO Enable correct filtering */}
          {/* {(!!tokensDataLength || !!searchValue) && <Filter />} */}
          <Button
            mode="primarySolid"
            className="ml-2"
            onClick={toggleAddFundsModalOn}
            size="small"
          >
            {formatText({ id: 'balancePage.table.addFunds' })}
          </Button>
        </>
      </TableWithHeaderAndMeatballMenu>
      <BalanceModal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
      >
        <>
          <h5 className="heading-5 mb-1.5">
            {formatText({ id: 'balancePage.modal.title' })}
          </h5>
          <p className="text-md text-gray-600 mb-6">
            {formatText({ id: 'balancePage.modal.subtitle' })}
          </p>
          <CopyWallet
            isCopied={isCopied}
            handleClipboardCopy={() => handleClipboardCopy(colonyAddress || '')}
            value={colonyAddress || ''}
          />
        </>
      </BalanceModal>
    </>
  );
};

BalanceTable.displayName = displayName;

export default BalanceTable;
