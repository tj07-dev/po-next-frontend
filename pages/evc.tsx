import axios from 'axios';
import { useRef, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { WorkBook } from 'xlsx';
import DataTable from '../components/EVC/dataTable/DataTable';
import FileUploader from '../components/EVC/fileUploader/FileUploader';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import config from '../config.json';
import { NextPageWithLayout } from './page';

export interface IEVC {
  workbook: WorkBook;
  selectedSheetIndex: number;
  setSelectedSheetIndex: typeof useState;
  setData: typeof useState;
  data: typeof Object;
  setHeader: typeof useState;
}

const EVC: NextPageWithLayout = () => {
  const [data, setData] = useState<[]>([]);
  const inputFileRef = useRef<any>();
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
  const [workbook, setWorkbook] = useState<WorkBook>({} as WorkBook);
  const [header, setHeader] = useState([]);
  const [fileError, setFileError] = useState<string>('');
  const [dataError, setDataError] = useState<string>('');
  const [sheetName, setSheetName] = useState([]);
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async () => {
    if (sheetName.length === 0) {
      setDataError('No data to submit.');
      return;
    }
    try {
      const response = await axios.post(`${config.SERVER_URL}xlData`, data);
      if (response.status === 404) {
        toast.error('404 (Not Found)');
      } else if (response.status === 200) {
        toast.success('Data Submitted Successfully');
      }
      toast.info(`${response.statusText}`);
    } catch (error: any) {
      toast.error(`${error.message}`);
      console.error(error.message, 'ENEVC');
    }
  };

  const handleRemoveFile = () => {
    setData([]);
    setWorkbook({} as WorkBook);
    setFileError('');
    setSheetName([]);
    inputFileRef.current.value = '';
    // toast.info(`${error.message}`);
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <FileUploader
            data={data}
            fileError={fileError}
            setData={setData}
            setWorkbook={setWorkbook}
            setFileError={setFileError}
            inputFileRef={inputFileRef}
            handleRemoveFile={handleRemoveFile}
            setSheetName={setSheetName}
            sheetName={sheetName}
            setHeader={setHeader}
          />
        </Col>
      </Row>
      {sheetName?.length > 0 && (
        <Row className="mt-3">
          <Col>
            {/* <SheetSelector
              workbook={workbook}
              selectedSheetIndex={selectedSheetIndex}
              setSelectedSheetIndex={setSelectedSheetIndex}
              setData={setData}
              data={data}
              setHeader={setHeader}
            /> */}
            {validationError && (
              <Alert variant="danger">{validationError}</Alert>
            )}
            <Button
              className="my-3"
              variant="outline-dark"
              onClick={() => {
                setShowComponent(!showComponent);
              }}
            >
              {showComponent ? 'Hide' : 'Show'} Table
            </Button>

            <span className="mx-2"></span>
            <Button
              className="my-3"
              variant="outline-danger"
              onClick={handleRemoveFile}
            >
              Reset
            </Button>
            <span className="mx-2"></span>
            <Button
              className="my-3"
              variant="outline-primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <span className="mx-2"></span>
            {showComponent && <DataTable data={data} headers={header} />}

            {dataError && <Alert variant="warning">{dataError}</Alert>}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EVC;
EVC.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
