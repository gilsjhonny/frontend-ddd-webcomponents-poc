import { describe, it, afterEach, beforeEach, expect, vi } from 'vitest';
import { DocumentContributor } from '../../domain/valueObjects/DocumentContributor';
import { getByLabelTextFromShadowRoot } from '../../../../tests/shadow-dom-utils';
import { AddDocumentFormComponent, registerAddDocumentFormComponent } from './AddDocumentForm';

registerAddDocumentFormComponent();

describe('AddDocumentFormComponent', () => {
  let element: AddDocumentFormComponent;

  beforeEach(() => {
    element = document.createElement(AddDocumentFormComponent.componentName) as AddDocumentFormComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when the form is rendered', () => {
    it('should render the form with all input fields and a disabled submit button', () => {
      const shadowRoot = element.shadowRoot!;

      expect(getByLabelTextFromShadowRoot(shadowRoot, 'Document Name')).toBeInTheDocument();
      expect(getByLabelTextFromShadowRoot(shadowRoot, 'Version')).toBeInTheDocument();
      expect(
        getByLabelTextFromShadowRoot(shadowRoot, 'Contributors (format: id1:name1, id2:name2)')
      ).toBeInTheDocument();
      expect(getByLabelTextFromShadowRoot(shadowRoot, 'Attachments (comma-separated)')).toBeInTheDocument();

      const submitButton = shadowRoot.querySelector('.submit-button') as HTMLButtonElement;
      expect(submitButton).toBeInTheDocument();
      expect(submitButton.disabled).toBeTruthy();
    });
  });

  describe('when inputs are filled out correctly', () => {
    beforeEach(() => {
      const shadowRoot = element.shadowRoot!;

      const nameInput = shadowRoot.querySelector('#name') as HTMLInputElement;
      nameInput.value = 'Test Document';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      const versionInput = shadowRoot.querySelector('#version') as HTMLInputElement;
      versionInput.value = '1.0';
      versionInput.dispatchEvent(new Event('input', { bubbles: true }));

      const contributorsInput = shadowRoot.querySelector('#contributors') as HTMLInputElement;
      contributorsInput.value = '1:John Doe, 2:Jane Smith';
      contributorsInput.dispatchEvent(new Event('input', { bubbles: true }));

      const attachmentsInput = shadowRoot.querySelector('#attachments') as HTMLInputElement;
      attachmentsInput.value = 'file1.pdf, file2.pdf';
      attachmentsInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    it('should enable the submit button', () => {
      const submitButton = element.shadowRoot!.querySelector('.submit-button') as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });

    it('should correctly update document data', () => {
      const documentData = element.getDocumentData();

      expect(documentData.name).toBe('Test Document');
      expect(documentData.version).toBe('1.0');
      expect(documentData.contributors).toEqual([
        DocumentContributor.createFromProperties('1', 'John Doe'),
        DocumentContributor.createFromProperties('2', 'Jane Smith'),
      ]);
      expect(documentData.attachments).toEqual(['file1.pdf', 'file2.pdf']);
    });
  });

  describe('when the form is submitted', () => {
    beforeEach(() => {
      const nameInput = element.shadowRoot!.querySelector('#name') as HTMLInputElement;
      nameInput.value = 'Test Document';
      nameInput.dispatchEvent(new Event('input'));

      const submitButton = element.shadowRoot!.querySelector('.submit-button') as HTMLButtonElement;
      submitButton.disabled = false;

      const form = element.shadowRoot!.querySelector('form') as HTMLFormElement;
      vi.spyOn(element, 'dispatchEvent');
      form.dispatchEvent(new Event('submit'));
    });

    it('should dispatch a "document-submitted" event with the correct detail', () => {
      expect(element.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'document-submitted',
          detail: element.getDocumentData(),
        })
      );
    });
  });
});
