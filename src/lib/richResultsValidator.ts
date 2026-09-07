export interface SchemaValidationError {
  id: string;
  field: string;
  rule: string;
  message: string;
  severity: 'critical' | 'warning' | 'recommendation';
  fixRecommendation: string;
  line?: number;
}

export interface RichResultsValidationReport {
  targetView: string;
  entityTypes: string[];
  isValid: boolean;
  score: number; // 0 - 100
  passedChecks: string[];
  errors: SchemaValidationError[];
  googleEligibility: {
    datasetSearch: boolean;
    softwareAppCard: boolean;
    sitelinksSearchbox: boolean;
    breadcrumbsSnippet: boolean;
    starRatingSnippet: boolean;
  };
  validatedAt: string;
}

/**
 * Deep validation of JSON-LD structured data against Google Search Central Rich Results standards
 */
export function validateJsonLdForGoogleRichResults(
  jsonLdRaw: string,
  targetView: string
): RichResultsValidationReport {
  const errors: SchemaValidationError[] = [];
  const passedChecks: string[] = [];
  let parsedObj: any = null;

  // 1. JSON Syntax Check
  try {
    parsedObj = JSON.parse(jsonLdRaw);
    passedChecks.push('JSON syntax is well-formed with valid character encoding');
  } catch (err: any) {
    return {
      targetView,
      entityTypes: [],
      isValid: false,
      score: 0,
      passedChecks: [],
      errors: [
        {
          id: 'err-syntax',
          field: 'root',
          rule: 'Valid JSON-LD Syntax',
          message: `Malformed JSON syntax: ${err.message}`,
          severity: 'critical',
          fixRecommendation: 'Ensure all keys are double-quoted and brackets are balanced.'
        }
      ],
      googleEligibility: {
        datasetSearch: false,
        softwareAppCard: false,
        sitelinksSearchbox: false,
        breadcrumbsSnippet: false,
        starRatingSnippet: false
      },
      validatedAt: new Date().toISOString()
    };
  }

  // 2. Validate Context
  if (parsedObj['@context'] !== 'https://schema.org' && parsedObj['@context'] !== 'http://schema.org') {
    errors.push({
      id: 'err-context',
      field: '@context',
      rule: 'Schema.org Namespace',
      message: 'Missing or invalid @context property. Must be "https://schema.org".',
      severity: 'critical',
      fixRecommendation: 'Add "@context": "https://schema.org" at root or within each graph entity.'
    });
  } else {
    passedChecks.push('Valid Schema.org namespace declaration (@context: "https://schema.org")');
  }

  // Extract entities (support single entity or @graph array)
  const entities: any[] = Array.isArray(parsedObj['@graph']) 
    ? parsedObj['@graph'] 
    : [parsedObj];

  const entityTypes: string[] = entities.map(e => String(e['@type'])).filter(Boolean);

  // 3. Entity checks
  let hasDataset = false;
  let hasSoftwareApp = false;
  let hasBreadcrumbs = false;
  let hasRating = false;

  entities.forEach((entity, index) => {
    const type = entity['@type'];
    const prefix = `@graph[${index}] (${type})`;

    if (!type) {
      errors.push({
        id: `err-type-${index}`,
        field: `@graph[${index}].@type`,
        rule: 'Entity Type Required',
        message: `Entity at position ${index} is missing @type declaration.`,
        severity: 'critical',
        fixRecommendation: 'Specify a recognized Schema.org type such as Dataset or SoftwareApplication.'
      });
      return;
    }

    // Required fields: name and url / @id
    if (!entity.name || typeof entity.name !== 'string' || !entity.name.trim()) {
      errors.push({
        id: `err-name-${index}`,
        field: `${prefix}.name`,
        rule: 'Entity Name',
        message: `Missing or empty "name" property for ${type}.`,
        severity: 'critical',
        fixRecommendation: 'Provide a descriptive title for this entity.'
      });
    } else {
      passedChecks.push(`${type} entity contains valid non-empty name ("${entity.name.slice(0, 30)}...")`);
    }

    // Canonical URL check
    if (entity.url && !String(entity.url).startsWith('https://')) {
      errors.push({
        id: `err-url-${index}`,
        field: `${prefix}.url`,
        rule: 'Secure Canonical URL',
        message: `URL "${entity.url}" does not use HTTPS protocol.`,
        severity: 'warning',
        fixRecommendation: 'Google requires all canonical URLs to use https://.'
      });
    }

    // SPECIALIZED VALIDATION: Observatory (Dataset)
    if (type === 'Dataset') {
      hasDataset = true;
      if (!entity.description || entity.description.length < 50) {
        errors.push({
          id: 'err-dataset-desc',
          field: `${prefix}.description`,
          rule: 'Google Dataset Search Guidelines',
          message: 'Dataset description is shorter than recommended 50 characters.',
          severity: 'warning',
          fixRecommendation: 'Google Dataset Search requires a comprehensive summary of variables, provenance, and spatial resolution.'
        });
      } else {
        passedChecks.push('Dataset meets Google Dataset Search description length standard');
      }

      if (!entity.variableMeasured || !Array.isArray(entity.variableMeasured) || entity.variableMeasured.length === 0) {
        errors.push({
          id: 'warn-dataset-vars',
          field: `${prefix}.variableMeasured`,
          rule: 'Google Dataset Search Guidelines',
          message: 'Missing "variableMeasured" array for Earth telemetry dataset.',
          severity: 'recommendation',
          fixRecommendation: 'Add variableMeasured array (e.g. ["SMAP Soil Moisture", "SWAT Runoff Coefficient", "Canopy NDVI"]).'
        });
      } else {
        passedChecks.push(`Dataset specifies ${entity.variableMeasured.length} measured empirical variables`);
      }

      if (!entity.spatialCoverage) {
        errors.push({
          id: 'warn-dataset-spatial',
          field: `${prefix}.spatialCoverage`,
          rule: 'Spatial Coverage Recommendation',
          message: 'Missing spatialCoverage property for planetary observatory data.',
          severity: 'recommendation',
          fixRecommendation: 'Define spatialCoverage with Place or GeoShape to enhance Google Earth & Dataset search indexing.'
        });
      } else {
        passedChecks.push('Dataset includes spatialCoverage geographic boundary geometry');
      }

      if (!entity.license) {
        errors.push({
          id: 'warn-dataset-license',
          field: `${prefix}.license`,
          rule: 'Dataset License Transparency',
          message: 'Missing open access license URI.',
          severity: 'recommendation',
          fixRecommendation: 'Provide a Creative Commons license URL (e.g., https://creativecommons.org/licenses/by/4.0/).'
        });
      } else {
        passedChecks.push('Dataset provides verified open-access license URI');
      }
    }

    // SPECIALIZED VALIDATION: Agent Mission Control (SoftwareApplication)
    if (type === 'SoftwareApplication') {
      hasSoftwareApp = true;
      if (!entity.applicationCategory) {
        errors.push({
          id: 'err-software-category',
          field: `${prefix}.applicationCategory`,
          rule: 'Google Software App Rich Result Standard',
          message: 'Missing "applicationCategory" property.',
          severity: 'critical',
          fixRecommendation: 'Add applicationCategory (e.g. "BusinessApplication" or "ScientificSoftware").'
        });
      } else {
        passedChecks.push(`SoftwareApplication declares valid category: "${entity.applicationCategory}"`);
      }

      if (!entity.operatingSystem) {
        errors.push({
          id: 'err-software-os',
          field: `${prefix}.operatingSystem`,
          rule: 'Google Software App Rich Result Standard',
          message: 'Missing "operatingSystem" property.',
          severity: 'warning',
          fixRecommendation: 'Specify supported operating systems (e.g., "Web, Edge IoT, Cloud Run").'
        });
      } else {
        passedChecks.push(`SoftwareApplication declares operatingSystem: "${entity.operatingSystem}"`);
      }

      if (entity.aggregateRating) {
        hasRating = true;
        const rating = entity.aggregateRating;
        const val = parseFloat(rating.ratingValue);
        if (isNaN(val) || val < 1 || val > 5) {
          errors.push({
            id: 'err-rating-val',
            field: `${prefix}.aggregateRating.ratingValue`,
            rule: 'Google Rating Rich Snippet Standard',
            message: `Rating value "${rating.ratingValue}" must be a numeric score between 1 and 5.`,
            severity: 'critical',
            fixRecommendation: 'Ensure ratingValue is between 1.0 and 5.0.'
          });
        } else {
          passedChecks.push(`Valid aggregate rating score (${val}/5) with ${rating.reviewCount || 0} reviews`);
        }
      } else {
        errors.push({
          id: 'rec-software-rating',
          field: `${prefix}.aggregateRating`,
          rule: 'Star Rating Rich Snippet',
          message: 'Missing aggregateRating for software application.',
          severity: 'recommendation',
          fixRecommendation: 'Include aggregateRating with ratingValue and reviewCount to show golden review stars on Google SERP.'
        });
      }
    }

    // Breadcrumbs check
    if (type === 'BreadcrumbList') {
      hasBreadcrumbs = true;
      const items = entity.itemListElement;
      if (!Array.isArray(items) || items.length === 0) {
        errors.push({
          id: 'err-breadcrumbs-items',
          field: `${prefix}.itemListElement`,
          rule: 'Google Breadcrumbs Standard',
          message: 'BreadcrumbList itemListElement must be an array with at least 1 item.',
          severity: 'critical',
          fixRecommendation: 'Add array of ListItem elements with position, name, and item properties.'
        });
      } else {
        let sequential = true;
        items.forEach((crumb: any, cIdx: number) => {
          if (crumb.position !== cIdx + 1) sequential = false;
        });
        if (!sequential) {
          errors.push({
            id: 'warn-breadcrumbs-pos',
            field: `${prefix}.itemListElement`,
            rule: 'Google Breadcrumbs Sequential Indexing',
            message: 'Breadcrumb positions must be sequential starting at 1.',
            severity: 'warning',
            fixRecommendation: 'Ensure position matches 1, 2, 3... corresponding to the navigational hierarchy.'
          });
        } else {
          passedChecks.push(`BreadcrumbList has valid sequential ${items.length}-level navigation hierarchy`);
        }
      }
    }
  });

  // Target-view specific sanity checks
  if (targetView === 'observatory' && !hasDataset) {
    errors.push({
      id: 'err-target-observatory-dataset',
      field: '@graph',
      rule: 'Observatory Target Standard',
      message: 'Observatory view must include a Schema.org Dataset entity for Google Dataset Search integration.',
      severity: 'critical',
      fixRecommendation: 'Add a Dataset entity with SMAP and hydrological variables to the JSON-LD schema.'
    });
  }

  if (targetView === 'agent-mission-control' && !hasSoftwareApp) {
    errors.push({
      id: 'err-target-amc-software',
      field: '@graph',
      rule: 'Agent Mission Control Target Standard',
      message: 'Agent Mission Control view must include a Schema.org SoftwareApplication entity.',
      severity: 'critical',
      fixRecommendation: 'Add a SoftwareApplication entity with applicationCategory and featureList.'
    });
  }

  // Calculate score
  let score = 100;
  errors.forEach(err => {
    if (err.severity === 'critical') score -= 25;
    else if (err.severity === 'warning') score -= 10;
    else if (err.severity === 'recommendation') score -= 5;
  });
  score = Math.max(0, Math.min(100, score));

  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const isValid = criticalErrors.length === 0;

  return {
    targetView,
    entityTypes,
    isValid,
    score,
    passedChecks,
    errors,
    googleEligibility: {
      datasetSearch: hasDataset && isValid,
      softwareAppCard: hasSoftwareApp && isValid,
      sitelinksSearchbox: true,
      breadcrumbsSnippet: hasBreadcrumbs && isValid,
      starRatingSnippet: hasRating && isValid
    },
    validatedAt: new Date().toISOString()
  };
}
