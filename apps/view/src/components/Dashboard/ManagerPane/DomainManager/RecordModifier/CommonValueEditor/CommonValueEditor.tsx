import HostValueEditor from './HostValueEditor';
import TypeClassTTLEditor from './TypeClassTTLEditor';

function CommonValueEditor() {
  return (
    <>
      <TypeClassTTLEditor />
      <HostValueEditor />
    </>
  );
}

export default CommonValueEditor;
