import axios from 'axios';
import { useRef, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DataTable from '../components/EVC/dataTable/DataTable';
import FileUploader from '../components/EVC/fileUploader/FileUploader';
import SheetSelector from '../components/EVC/sheetSelector/SheetSelector';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import config from '../config.json';
import { NextPageWithLayout } from './page';

const EVC: NextPageWithLayout = () => {
  const [data, setData] = useState([]);
  const inputFileRef = useRef<any>();
  const [showComponent, setShowComponent] = useState(false);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [header, setHeader] = useState([]);
  const [fileError, setFileError] = useState('');
  const [dataError, setDataError] = useState('');
  const [sheetName, setSheetName] = useState([]);
  const [validationError, setValidationError] = useState('');

  // const handleSubmit = async (e) => {
  //     if (data.length === 0) {
  //         setDataError('No data to submit.');
  //         return;
  //     }
  //     try {
  //         const response = await axios
  //             .post(`${config.SERVER_URL}xlData`, data)
  //             .then((d) => {
  //                 if (d.status === 404) toast.error('404 (Not Found)');
  //                 if (d.status === 200)
  //                     toast.success('Data Submitted Successfully');
  //                 toast.info(`${d.statusText}`);
  //             });
  //     } catch (error: any) {
  //         toast.error(`${error?.message}`);
  //         console.error(error?.message, 'ENEVC');
  //     }
  // };

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
    setWorkbook(null);
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
