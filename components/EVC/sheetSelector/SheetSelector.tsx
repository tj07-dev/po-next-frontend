import { Dispatch, SetStateAction, useEffect } from 'react';
import { Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { WorkBook, utils } from 'xlsx';

export interface ISheetSelector {
  workbook: WorkBook;
  selectedSheetIndex: number;
  setSelectedSheetIndex: Dispatch<SetStateAction<number>>;
  setData: Dispatch<SetStateAction<Array<string>>>;
  data: typeof Object;
  setHeader: Dispatch<SetStateAction<string>>;
}

const SheetSelector = ({
  workbook,
  selectedSheetIndex,
  setSelectedSheetIndex,
  setData,
  data,
  setHeader,
}: ISheetSelector) => {
  useEffect(() => {
    setSelectedSheetIndex(0);
  }, []);

  useEffect(() => {
    const readData = () => {
      const sheetdata = data;
      setData(sheetdata);
    };
    readData();
  }, [data, setData]);

  const handleSelectChange = (e: any) => {
    setSelectedSheetIndex(e);
    const worksheetNames = workbook.SheetNames;
    const selectedWorksheet = workbook.Sheets[worksheetNames[e]];
    const sheetData: Array<string> = utils.sheet_to_json(selectedWorksheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd',
      // cellDates: true,
    });
    const sheetData1: Array<string> = utils.sheet_to_json(selectedWorksheet, {
      header: 1,
      raw: false,
      dateNF: 'yyyy-mm-dd',
      // cellDates: true,
    });
    console.log(sheetData1, 'sheetdata header');
    setData(sheetData);
    setHeader(sheetData1[0]);
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between mt-1">
          <h5 className="mt-1 fw-bolder">
            Selected Sheet: {workbook.SheetNames[selectedSheetIndex]}
          </h5>
          <DropdownButton
            className="mb-1"
            variant="outline-dark"
            title="Select sheet"
            onSelect={handleSelectChange}
          >
            {workbook.SheetNames.map((sheetName: any, index: number) => (
              <Dropdown.Item key={index} eventKey={index}>
                {sheetName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SheetSelector;
