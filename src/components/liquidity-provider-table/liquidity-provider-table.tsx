import {
    Skeleton,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TableContainer,
  } from "soroswap-ui";
  
  import { visuallyHidden } from "@mui/utils";
  import { useRouter } from "next/router";
  import * as React from "react";
  import useTable from "../../hooks/use-table";
  import { Token } from "../../types/tokens";
  import { formatNumberToMoney } from "../../utils/utils";
  import TokenImage from "../token";
  import { StyledCard } from "components/styled/card";
  import { StyledTableCell } from "components/styled/table-cell";
  import { useTheme } from "soroswap-ui";
  
  interface HeadCell {
    id: keyof Token;
    label: string;
    numeric: boolean;
  }
  
  const headCells: readonly HeadCell[] = [
    {
      id: "asset",
      numeric: false,
      label: "Name",
    },
    {
      id: "price",
      numeric: true,
      label: "Account",
    },
    /*   {
      id: "change",
      numeric: true,
      label: "Price Change",
    }, */
    
    {
      id: "tvl",
      numeric: true,
      label: "TVL",
    },
    {
        id: "volume24h",
        numeric: true,
        label: "Pool Share",
      },
  ];
  
  interface TokensTableProps {
    onRequestSort: (
      event: React.MouseEvent<unknown>,
      property: keyof Token
    ) => void;
    order: "asc" | "desc";
    orderBy: string;
  }
  
  function TokensTableHead(props: TokensTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
      (property: keyof Token) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead>
        <TableRow sx={{ bgcolor: "#1b1b1b" }}>
          <StyledTableCell>#</StyledTableCell>
          {headCells.map((headCell) => (
            <StyledTableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  export default function TokensTable({
    rows,
    emptyMessage = "No tokens found",
    isLoading = false,
    itemsPerPage = 10,
  }: {
    rows: Token[];
    emptyMessage?: string;
    isLoading?: boolean;
    itemsPerPage?: number;
  }) {
    const {
      order,
      orderBy,
      handleRequestSort,
      visibleRows,
      emptyRows,
      rowsPerPage,
      page,
      handleChangePage,
      handleChangeRowsPerPage,
    } = useTable<Token>({
      rows,
      defaultOrder: "desc",
      defaultOrderBy: "tvl",
      itemsPerPage,
    });
  
    const router = useRouter();
  
    const onClickRow = (token: string) => {
      router.push({
        pathname: `/tokens/${token}`,
        query: {
          network: router.query.network,
        },
      });
    };
  
    const theme = useTheme();
  
    if (isLoading) {
      return <Skeleton variant="rounded" height={300} />;
    }
  
    return (
      <Box sx={{ width: "100%" }}>
        <StyledCard sx={{ width: "100%" }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TokensTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(2n)": {
                          bgcolor: "#1b1b1b",
                        },
                        "&:hover": {
                          cursor: "pointer",
                          bgcolor: theme.palette.background.paper,
                          borderTop: `1px solid ${theme.palette.customBackground.accentAction}`,
                          borderBottom: `1px solid ${theme.palette.customBackground.accentAction}`,
                        },
                        bgcolor: "transparent",
                      }}
                      component="a"
                      href={`/tokens/${row.asset.contract}?network=${router.query.network}`}
                    >
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell
                        align="left"
                        sx={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                        }}
                      >
                        <TokenImage imageUrl={row.asset.icon} />
                        {row.asset.name ?? row.asset.code}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {formatNumberToMoney(row.price)}
                      </StyledTableCell>
                      {/*     <StyledTableCell align="right">
                        <PercentageChanged percentage={row.priceChange24h} />
                      </StyledTableCell> */}
                      <StyledTableCell align="right">
                        {formatNumberToMoney(row.volume24h)}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {formatNumberToMoney(row.tvl, 2)}
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <StyledTableCell colSpan={6} />
                  </TableRow>
                )}
                {visibleRows.length === 0 && (
                  <TableRow>
                    <StyledTableCell colSpan={6} align="center">
                      No tokens found
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[]}
          />
        </StyledCard>
      </Box>
    );
  }
  