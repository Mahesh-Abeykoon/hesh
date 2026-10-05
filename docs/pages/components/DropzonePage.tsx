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
      importStatement="import { Dropzone } from 'hesh';"
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
            { name: 'onFiles', type: '(files: DropzoneFile[]) => void', required: true, description: 'Callback with the accepted file objects.' },
            { name: 'accept', type: 'string', description: 'MIME types or extensions (e.g. "image/*,.pdf").' },
            { name: 'maxFiles', type: 'number', default: '5', description: 'Maximum allowed files in a single batch.' },
            { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes.' },
            { name: 'hint', type: 'string', description: 'Helper text displayed beneath the drop target.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables drag and file picker triggers.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
