import styled from 'styled-components';

const LayoutStyle = styled.div`
  .ant-layout {
    background: unset;
  }
  .ant-page-header {
    padding: 16px;
    box-shadow: 0px 1px 5px #cdcdcd;
  }
  .ant-layout-content {
    padding: 16px;
    background: unset;
    display: flex;
    justify-content: center;

    .container {
      max-width: 768px;
      width: 100%;
      padding-top: 24px;
    }
  }
  .ant-layout-footer {
    padding: 16px;
    background: unset;
  }
`;
export default LayoutStyle;
