import { Link } from 'react-router-dom';
import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

function Disclaimer() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="Important information about the use of ToolNexa tools and the limitations of our services."
    >
      <LegalSection title="General Information">
        <p>
          The information and tools provided on ToolNexa are offered on an &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; basis. While we aim to deliver accurate and useful results, we
          make no warranties or guarantees regarding completeness, reliability, or suitability for any
          particular purpose.
        </p>
      </LegalSection>

      <LegalSection title="Tool Output Accuracy">
        <p>
          Results from AI generators, converters, compressors, and other automated tools may contain
          errors or inaccuracies. You should review all output before using it in professional,
          academic, legal, or commercial contexts.
        </p>
      </LegalSection>

      <LegalSection title="No Professional Advice">
        <p>
          ToolNexa does not provide legal, medical, financial, tax, or other professional advice. Content
          generated or processed through our tools should not be relied upon as a substitute for advice
          from a qualified professional.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <p>
          Some features depend on third-party APIs and services. We are not responsible for the
          availability, policies, or actions of those third parties. Your use of such features may be
          subject to additional terms imposed by those providers.
        </p>
      </LegalSection>

      <LegalSection title="File and Data Handling">
        <p>
          You are responsible for backing up your files and data. Although many tools process content
          securely and temporarily, you should not upload sensitive or confidential information unless
          you understand and accept the associated risks.
        </p>
      </LegalSection>

      <LegalSection title="External Links">
        <p>
          ToolNexa may contain links to external websites. We do not control and are not responsible for
          the content, privacy practices, or availability of third-party sites.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          By using ToolNexa, you acknowledge that we shall not be held liable for any loss or damage
          arising from your use of the website, tools, or generated output, including direct or
          indirect damages to the maximum extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          If you have questions about this Disclaimer, please visit our{' '}
          <Link to="/contact-us" className="font-semibold text-brand-600 hover:text-brand-700">
            Contact Us
          </Link>{' '}
          page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default Disclaimer;
