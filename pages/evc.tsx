import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { WorkBook } from 'xlsx';
import DataTable from '../components/EVC/dataTable/DataTable';
import FileUploader from '../components/EVC/fileUploader/FileUploader';
import SheetSelector from '../components/EVC/sheetSelector/SheetSelector';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import config from '../config.json';
import { NextPageWithLayout } from './page';

const EVC: NextPageWithLayout = () => {
  const [data, setData] = useState<string[]>([]);
  const inputFileRef = useRef<any>();
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState<WorkBook>({} as WorkBook);
  const [header, setHeader] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string>('');
  const [dataError, setDataError] = useState<string>('');
  const [sheetName, setSheetName] = useState<string[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    document.title = 'EVC';
  }, []);

  const handleSubmit = async () => {
    const id = toast.loading('Submiting...', {
      position: 'bottom-right',
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    if (sheetName.length === 0) {
      setDataError('No data to submit.');
      return;
    }
    try {
      const response = await axios.post(`${config.SERVER_URL}xlData`, data);

      if (response.status === 404) {
        toast.update(id, {
          render: '404, File Not Found.',
          type: 'error',
          isLoading: false,
          autoClose: 300,
        });
      } else if (response.status === 200) {
        // toast.success('Data Submitted Successfully');
        toast.update(id, {
          render: 'Data Submitted Successfully.',
          type: 'success',
          isLoading: false,
          autoClose: 300,
        });
      }
    } catch (error: any) {
      toast.update(id, {
        render: `${error.message}.`,
        type: 'error',
        isLoading: false,
        autoClose: 300,
      });
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
    <Container className=" mb-5">
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
            <SheetSelector
              workbook={workbook}
              selectedSheetIndex={selectedSheetIndex}
              setSelectedSheetIndex={setSelectedSheetIndex}
              setData={setData}
              data={data}
              setHeader={setHeader}
            />
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
