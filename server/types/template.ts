export interface Template {
  $class: string;
  name: string;
  author: string;
  displayName?: string;
  version: string;
  description?: string;
  license: string;
  keywords?: string[];
  logo?: any; // Placeholder for org.accordproject.protocol@1.0.0.Blob
  templateModel: any; // Placeholder for org.accordproject.protocol@1.0.0.TemplateModel
  text: any; // Placeholder for org.accordproject.protocol@1.0.0.Text
  logic?: any; // Placeholder for org.accordproject.protocol@1.0.0.Logic
  request?: Record<string, any>; // Optional sample request
}
