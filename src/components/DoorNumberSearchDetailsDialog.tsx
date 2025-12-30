"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/components/PopupDialog.module.scss";
import { Table } from "react-bootstrap";
import { useTable, usePagination ,Column,TableInstance} from "react-table";
import Image from "next/image";
import { PopupAction } from "../redux/commonSlice";
import { useAppDispatch } from "../redux/hooks";

type Owner = {
  ownerName: string;
  mobileNo: string;
};

type DataRow = {
  ulbCode: string;
  assessmentNo: string;
  active: boolean;
  underworkflow: boolean;
  houseNo: string;
  exempted: boolean;
  ownerDetails: Owner[];
  regdDocNo: string | null;
  regdDocDate: string;
  category: string;
};

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: Function;
  data: DataRow[];
  autoCloseEmpty?: boolean;
}

const PopupDialog: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  data,
  autoCloseEmpty = false,
}) => {
  const dispatch = useAppDispatch();
  const [selectedRow, setSelectedRow] = useState<any>({});
  const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message, autoHide: false, hideCancelButton: false})); }

  useEffect(() => {
    if (data.length === 0 && show && autoCloseEmpty) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [data, show, autoCloseEmpty, onClose]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Assessment No",
        accessor: "assessmentNo",
      },
      {
        Header: "Door No.[డోర్ నెం.]",
        accessor: "houseNo",
      },
      {
        Header: "Owner Details [యజమాని వివరాలు]",
        accessor: "ownerDetails",
        Cell: ({ value }: { value: Owner[] }) =>
          value.map((owner, i) => <div key={i}>{owner.ownerName}</div>),
      },
      {
        Header: "Select [ఎంచుకోండి]",
        id: "select",
        Cell: ({ row }: any) => (
          <input
            name="cdmaassessmentselection"
            type="radio"
            value={row.original.assessmentNo}
            checked={selectedRow?.assessmentNo === row.original.assessmentNo}
            onChange={() => setSelectedRow(row.original)}
          />
        ),
      },
    ],
    [selectedRow]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 } as any,
    },
    usePagination
  ) as any;

  const onNo = () => {
    ShowAlert('info',"Ensure that there is no PTIN for the entered Door Number, otherwise it will lead to legal complications.",);
    onClose();
  }

  const onYes = (row) => {
    if (!row?.assessmentNo) {
      ShowAlert(false, "Please select atleast one assessment from the above list",);
    } else {
      onSubmit(row);
    }
  }

  return (
    <div
      className={`modal fade ${show ? "d-block show" : "d-none"} ${styles.modalDialog}`}
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header sticky-top bg-primary text-white" style={{ zIndex: 1055 }}>
            <h5 className="modal-title">Select Property Record</h5>
          </div>

          <div className="modal-body p-0">
            {data.length > 0 ? (
              <>
                <div className={styles["table-container"]}>
                  <Table striped bordered hover className="TableData" {...getTableProps()}>
                    <thead className={styles["table-sticky-header"]}>
                      {headerGroups.map((headerGroup,idx) => (
                        <tr key={idx} {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column,colIdx) => (
                            <th  key={colIdx} {...column.getHeaderProps()}>{column.render("Header")}</th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row,index) => {
                        prepareRow(row);
                        return (
                          <tr key={index}
                            {...row.getRowProps()}
                            className={row.index % 2 === 0 ? "table-light" : "table-white"}
                          >
                            {row.cells.map((cell,i) => (
                              <td key={i} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="paginationMain p-2">
                  <ul className="pagination d-flex align-items-center justify-content-end m-0">
                    <li className="PageItems me-3">
                      Items per page:{" "}
                      <select
                        className="text-center"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                      >
                        {[20, 30, 50].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </li>
                    <li className="pagesList me-2">
                      <a className="page-link">Page {pageIndex + 1} of {pageOptions.length}</a>
                    </li>
                    <li className="paginationPrev pageNav me-1" onClick={previousPage}>
                      <a className="page-link">
                        <Image alt="Prev" width={15} height={18} src="/PDE/images/pagination-prev.jpg" />
                      </a>
                    </li>
                    <li className="paginationNext pageNav" onClick={nextPage}>
                      <a className="page-link">
                        <Image alt="Next" width={15} height={18} src="/PDE/images/pagination-next.jpg" />
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center text-center p-4 fs-5 overflow-auto"
                style={{ height: "200px" }}
              >
                No data available
              </div>
            )}
          </div>

          <div className={`modal-footer sticky-bottom ${styles["sticky-bottom"]}`}>
            {data.length > 0 && (
              <>
                <button type="button" className={`btn ${styles["btn-submit"]}`} onClick={onNo}>
                  No
                </button>
                <button type="button" className={`btn ${styles["btn-submit"]}`} onClick={() => onYes(selectedRow)}>
                  Yes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDialog;
