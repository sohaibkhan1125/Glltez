import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AIWriter from './pages/AIWriter';
import TextSummarizer from './pages/TextSummarizer';
import CodeAssistant from './pages/CodeAssistant';
import ArticleRewriter from './pages/ArticleRewriter';
import EmailWriter from './pages/EmailWriter';
import BlogPostGenerator from './pages/BlogPostGenerator';
import AdCopyGenerator from './pages/AdCopyGenerator';
import ScriptGenerator from './pages/ScriptGenerator';
import SocialCaptionGenerator from './pages/SocialCaptionGenerator';
import StoryGenerator from './pages/StoryGenerator';
import SeoTitleGenerator from './pages/SeoTitleGenerator';
import InvoiceGenerator from './pages/InvoiceGenerator';
import MergePdf from './pages/MergePdf';
import CompressPdf from './pages/CompressPdf';
import PdfToWord from './pages/PdfToWord';
import HtmlToPdf from './pages/HtmlToPdf';
import WebToPdf from './pages/WebToPdf';
import XlsxToPdf from './pages/XlsxToPdf';
import PdfToJpg from './pages/PdfToJpg';
import PdfToPng from './pages/PdfToPng';
import DeletePdfPages from './pages/DeletePdfPages';
import CropPdf from './pages/CropPdf';
import ProtectPdf from './pages/ProtectPdf';
import PdfWatermark from './pages/PdfWatermark';
import ImageCompressor from './pages/ImageCompressor';
import FormatConverter from './pages/FormatConverter';
import BackgroundRemover from './pages/BackgroundRemover';
import JpgToPng from './pages/JpgToPng';
import JpgToWebp from './pages/JpgToWebp';
import PngToJpg from './pages/PngToJpg';
import PngToSvg from './pages/PngToSvg';
import PngToWebp from './pages/PngToWebp';
import PptxToPng from './pages/PptxToPng';
import PsdToJpg from './pages/PsdToJpg';
import SvgToPng from './pages/SvgToPng';
import XlsxToPng from './pages/XlsxToPng';
import JsonFormatter from './pages/JsonFormatter';
import Base64EncoderDecoder from './pages/Base64EncoderDecoder';
import HtmlMinifier from './pages/HtmlMinifier';
import CssMinifier from './pages/CssMinifier';
import JavaScriptMinifier from './pages/JavaScriptMinifier';
import LoremIpsumGenerator from './pages/LoremIpsumGenerator';
import WordCharacterCounter from './pages/WordCharacterCounter';
import TextCaseConverter from './pages/TextCaseConverter';
import PasswordGenerator from './pages/PasswordGenerator';
import QrCodeGenerator from './pages/QrCodeGenerator';
import ColorConverter from './pages/ColorConverter';
import ColorPickerPalette from './pages/ColorPickerPalette';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import ContactUs from './pages/ContactUs';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-tools" element={<HomePage scrollTarget="ai-tools" />} />
          <Route path="/pdf-tools" element={<HomePage scrollTarget="pdf-tools" />} />
          <Route path="/image-tools" element={<HomePage scrollTarget="image-tools" />} />
          <Route path="/other-tools" element={<HomePage scrollTarget="other-tools" />} />
          <Route path="/how-to-use" element={<HomePage scrollTarget="how-to-use" />} />
          <Route path="/faq" element={<HomePage scrollTarget="faq" />} />
          <Route path="/ai-writer" element={<AIWriter />} />
          <Route path="/text-summarizer" element={<TextSummarizer />} />
          <Route path="/code-assistant" element={<CodeAssistant />} />
          <Route path="/article-rewriter" element={<ArticleRewriter />} />
          <Route path="/email-writer" element={<EmailWriter />} />
          <Route path="/blog-post-generator" element={<BlogPostGenerator />} />
          <Route path="/ad-copy-generator" element={<AdCopyGenerator />} />
          <Route path="/script-generator" element={<ScriptGenerator />} />
          <Route path="/social-caption-generator" element={<SocialCaptionGenerator />} />
          <Route path="/story-generator" element={<StoryGenerator />} />
          <Route path="/seo-title-generator" element={<SeoTitleGenerator />} />
          <Route path="/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/html-to-pdf" element={<HtmlToPdf />} />
          <Route path="/web-to-pdf" element={<WebToPdf />} />
          <Route path="/xlsx-to-pdf" element={<XlsxToPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/pdf-to-png" element={<PdfToPng />} />
          <Route path="/delete-pdf-pages" element={<DeletePdfPages />} />
          <Route path="/crop-pdf" element={<CropPdf />} />
          <Route path="/protect-pdf" element={<ProtectPdf />} />
          <Route path="/pdf-watermark" element={<PdfWatermark />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/format-converter" element={<FormatConverter />} />
          <Route path="/background-remover" element={<BackgroundRemover />} />
          <Route path="/jpg-to-png" element={<JpgToPng />} />
          <Route path="/jpg-to-webp" element={<JpgToWebp />} />
          <Route path="/png-to-jpg" element={<PngToJpg />} />
          <Route path="/png-to-svg" element={<PngToSvg />} />
          <Route path="/png-to-webp" element={<PngToWebp />} />
          <Route path="/pptx-to-png" element={<PptxToPng />} />
          <Route path="/psd-to-jpg" element={<PsdToJpg />} />
          <Route path="/svg-to-png" element={<SvgToPng />} />
          <Route path="/xlsx-to-png" element={<XlsxToPng />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
          <Route path="/html-minifier" element={<HtmlMinifier />} />
          <Route path="/css-minifier" element={<CssMinifier />} />
          <Route path="/javascript-minifier" element={<JavaScriptMinifier />} />
          <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
          <Route path="/word-character-counter" element={<WordCharacterCounter />} />
          <Route path="/text-case-converter" element={<TextCaseConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/qr-code-generator" element={<QrCodeGenerator />} />
          <Route path="/color-converter" element={<ColorConverter />} />
          <Route path="/color-picker-palette" element={<ColorPickerPalette />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
