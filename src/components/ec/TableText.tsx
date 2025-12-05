import styles from "../../../styles/components/Table.module.scss";

interface PropsTypes {
  label: string;
  required: boolean;
  LeftSpace?: boolean;
}

const TableText = ({
  label,
  required = false,
  LeftSpace = false,
}: PropsTypes) => {
  return (
    <div>
      <text
        className={styles.columnText}
        style={{ paddingLeft: LeftSpace ? "14px" : "0px" }}
      >
        {label}
      </text>
      {required && (
        <text
          className={styles.columnText}
          style={{ color: "red", marginLeft: "5px" }}
        >
          *
        </text>
      )}
    </div>
  );
};

export default TableText;
