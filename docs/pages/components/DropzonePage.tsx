import { useState } from 'react';
import { Dropzone, type DropzoneFile } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DROPZONE_DEMO = `const [files, setFiles] = useState<DropzoneFile[]>([]);

<Dropzone
  accept="image/*,.pdf"
  maxFiles={5}
  maxSize={5 * 1024 * 1024}
  hint="PNG, JPG or PDF — up to 5MB each"
  onFiles={(newFiles) => setFiles(newFiles)}
/>`;

export function DropzonePage() {
  const [files, setFiles] = useState<DropzoneFile[]>([]);

  return (
    <DocPage
      eyebrow="Components"
      title="Dropzone"
      lede="Drag-and-drop file upload target with file type validation, size constraints, preview chips, and accessible file browsing."
      importStatement="import { Dropzone } from 'hesh-ui';"
    >
      <Section
        title="Interactive Dropzone"
        description="Drag files directly into the active region or click to open the native OS file picker."
      >
        <Showcase code={DROPZONE_DEMO} defaultOpen width="md">
          <Dropzone
            accept="image/*,.pdf"
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
            hint="PNG, JPG or PDF — up to 5MB each"
            simulateProgress
            onFilesChange={(newFiles) => setFiles(newFiles)}
          />
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Screen Reader & Keyboard File Browsing">
          A visually-hidden <code>&lt;input type="file"&gt;</code> element is kept in the tab order. Focusing the dropzone and pressing <kbd className="pui-kbd">Enter</kbd> or <kbd className="pui-kbd">Space</kbd> invokes the native file dialog seamlessly.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'onFilesChange', type: '(files: DropzoneFile[]) => void', description: 'Callback fired when the list of DropzoneFile objects (with status & progress) changes.' },
            { name: 'onFiles', type: '(files: File[]) => void', description: 'Callback with the raw accepted browser File objects.' },
            { name: 'files', type: 'DropzoneFile[]', description: 'Controlled list of file objects.' },
            { name: 'accept', type: 'string', description: 'MIME types or extensions (e.g. "image/*,.pdf").' },
            { name: 'multiple', type: 'boolean', default: 'true', description: 'Whether multiple files can be selected or dropped at once.' },
            { name: 'maxFiles', type: 'number', default: '10', description: 'Maximum allowed files in a batch.' },
            { name: 'maxSize', type: 'number', description: 'Maximum file size per file in bytes.' },
            { name: 'hint', type: 'string', description: 'Helper text displayed beneath the drop target.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables drag and file picker triggers.' },
            { name: 'simulateProgress', type: 'boolean', default: 'false', description: 'Simulates upload progress for interactive demos and prototyping.' },
            { name: 'className', type: 'string', description: 'Additional CSS class names.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
