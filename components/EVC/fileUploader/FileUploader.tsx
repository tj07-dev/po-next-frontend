import axios from 'axios';
import { read, utils, writeFile } from 'xlsx';
import config from '../../../config.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Card, Form } from 'react-bootstrap';

export interface IFileUploader {
  data: any;
  fileError: any;
  setData: any;
  setWorkbook: any;
  setFileError: any;
  inputFileRef: any;
  handleRemoveFile: any;
  setSheetName: any;
  sheetName: any;
  setHeader: any;
}

const FileUploader = ({
  fileError,
  setData,
  setWorkbook,
  setFileError,
  inputFileRef,
  handleRemoveFile,
  setSheetName,
  sheetName,
  setHeader,
}: IFileUploader) => {
  const downloadExcel = () => {
    axios.get(`${config.SERVER_URL}xlData`).then((d) => {
      console.log(d);
      const workbook = d.data;
      writeFile(workbook, 'AllData.xlsx');
    });
  };

  const handleFileUpload = (e: any) => {
    e.preventDefault();
    setFileError('');
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const workbook = read(event.target.result, {
          type: 'binary',
          cellFormula: true,
        });
        setWorkbook(workbook);
        setSheetName(workbook.SheetNames);
        const selectedWorksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData1 = utils.sheet_to_json(selectedWorksheet, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd',
          // cellDates: true,
        });
        const sheetData = utils.sheet_to_json(selectedWorksheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd',
          // cellDates: true,
        });
        setHeader(sheetData1[0]);

        // Modify sheet data
        const modifiedSheetData = sheetData.map((row, index) => {
          if (index === 1) {
            return Array.isArray(row)
              ? row.map((cell) => (cell == null || cell === '' ? 0 : cell))
              : row;
          }
          return row;
        });
        setData(modifiedSheetData);

        console.log(modifiedSheetData, 'sheetdata');
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setFileError('Error reading file. Please select a valid Excel file.');
    }
  };

  // const handleRemoveFile = () => {
  //     setData([]);
  //     setWorkbook(null);
  //     setFileError('');
  //     inputFileRef.current.value = '';
  // };

  return (
    <>
      <Button
        className="my-3 btn btn-outline-dark "
        variant="outline-dark"
        onClick={downloadExcel}
      >
        <i className="fa fa-download"> Download All Data</i>
      </Button>
      <Form>
        <Card className="text-center files">
          <Card.Header>Upload Excel file</Card.Header>
          <Card.Body>
            <Card.Text>
              <input
                placeholder="Select File.."
                title="file"
                type="file"
                name="file"
                onChange={handleFileUpload}
                ref={inputFileRef}
                accept=".xlsx"
                required
              />
              {sheetName?.length > 0 ? (
                <i className="fa fa-close" onClick={handleRemoveFile}>
                  {' '}
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{ color: '#000000' }}
                  />
                </i>
              ) : null}
            </Card.Text>
            {fileError ? <Alert variant="danger">{fileError}</Alert> : null}
          </Card.Body>
        </Card>
      </Form>
    </>
  );
};

export default FileUploader;
