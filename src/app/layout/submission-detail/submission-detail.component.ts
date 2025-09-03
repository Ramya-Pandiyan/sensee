import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { SubmissionService } from '../../core/services/submission.service';
import { SubmissionDetail, ChatMessage } from '../../data/model/submission.model';
import { NotificationService } from '../../core/services/notification.service';
import { ChatInterfaceComponent } from '../../shared/chat-interface/chat-interface.component';
import { EmailPreviewModalComponent } from '../../shared/email-preview-modal/email-preview-modal.component';
import { Common } from '../../shared/common/common.service';
import { MarkdownParserComponent } from '../../shared/markdown-parser/markdown-parser.component';
import { NotesPanelComponent } from '../../shared/notes-panel/notes-panel.component';
// Register Chart.js components
Chart.register(...registerables);

interface FollowUpQuestion {
  id: number;
  text: string;
}

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [CommonModule, ChatInterfaceComponent, EmailPreviewModalComponent, MarkdownParserComponent, NotesPanelComponent],
  templateUrl: './submission-detail.component.html',
  styleUrl: './submission-detail.component.scss'
})
export class SubmissionDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('coverageChart') coverageChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('occupancyChart') occupancyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('constructionChart') constructionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('yearBuiltChart') yearBuiltChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lossRunChart') lossRunChartRef!: ElementRef<HTMLCanvasElement>;

  submissionDetail: any | null = null;
  activeTab = 'email-summary';
  chatMessages: ChatMessage[] = [];
  isLoading = false;
  showEmailModal = false;
  submissionId = '';
  maxBullets = 0;
  
  private destroy$ = new Subject<void>();
  private charts: Chart[] = [];

  tabs = [
    { 
      id: 'email-summary', 
      label: 'Email Summary', 
      icon: 'assets/icons/mail-icon.svg', 
      iconActive: 'assets/icons/mail-icon copy.svg' 
    },
    { 
      id: 'insured', 
      label: 'Insured', 
      icon: 'assets/icons/insured-operations-icon.svg', 
      iconActive: 'assets/icons/insured-operations-icon copy.svg' 
    },
    { 
      id: 'sov', 
      label: 'SOV', 
      icon: 'assets/icons/underwriting.svg', 
      iconActive: 'assets/icons/underwriting copy.svg' 
    },
    { 
      id: 'loss-run', 
      label: 'Loss Run', 
      icon: 'assets/icons/lossrun.svg', 
      iconActive: 'assets/icons/lossrun copy.svg' 
    },
    { 
      id: 'missing-info', 
      label: 'Missing Info', 
      icon: 'assets/icons/alert.svg', 
      iconActive: 'assets/icons/alert copy.svg' 
    }
  ];

  chartColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
    private notificationService: NotificationService,
    private commonService: Common
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.submissionId = params['id'];
      this.loadSubmissionDetail();
    });
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  ngOnDestroy(): void {
    this.destroyCharts();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSubmissionDetail(): void {
    this.isLoading = true;
    
    // Updated mock data using the new JSON structure
    const mockData: any = {
  "_id": {
    "$oid": "68b69707f47d68fe98d3829b"
  },
  "submission_id": "SUB-0ade96f1-d283-4a9f-8d2a-70789a61989e",
  "txn_id": "1791de39-7c61-4d5d-ab47-654f62f1eb56",
  "user_id": "APP-USER-67f9b971",
  "email": {
    "insured_name": "Chemco Corporation",
    "broker_name": "Daniel Schumann",
    "policy_effective_date": "2024-04-01",
    "target_peril": "Windstorm (wind)",
    "target_coverages": "Property - Wind only",
    "target_limits": "NA",
    "target_sub_limits": "NA",
    "target_deductible": "NA",
    "broker_email": "daniel.schumann@amwins.com",
    "analysis_sections": [
      {
        "section_title": "🧭 Submission Context & Incumbent Program",
        "narrative": "The placement request centers on securing wind coverage for a program currently structured as AOP-only on a $10m primary layer for a two-building warehouse schedule supporting a cosmetics manufacturer. The submitting team indicates they are awaiting confirmation of the incumbent’s stance and will provide additional details. The physical risk is situated in South Florida, which materially elevates wind catastrophe exposure, while the cosmetics product profile introduces potential combustibility considerations within warehouse occupancies. There is a timing inconsistency between the submission date and the referenced policy term that should be reconciled prior to rating or binding.",
        "bullets": [
          "Program is split by peril intent (AOP in place; wind to be marketed separately).",
          "Two-warehouse schedule tied to manufacturing/warehousing operations for cosmetics (possible flammability from alcohol-based products).",
          "South Florida location implies heightened hurricane frequency/severity and building code implications.",
          "Timing/data integrity issue: email timing vs. listed policy period requires clarification."
        ]
      },
      {
        "section_title": "🌪️ Wind/CAT Exposure Considerations",
        "narrative": "Wind peril exposure is expected to be severe given regional hurricane climatology, with potential for both structural and contents loss amplification due to roof system vulnerability, opening protection, and age/condition of the buildings. Secondary modifiers (roof deck attachment, roof covering rating, roof-to-wall and wall-to-foundation connections, opening protection, building code year) and distance to coast will materially influence modeled loss outcomes and deductible strategy. Storage of flammable cosmetics or alcohol-based products may exacerbate post-storm loss severity through fire following wind or prolonged impairment scenarios if utilities or suppression systems are compromised.",
        "bullets": [
          "Critical COPE unknowns: construction, year built, roof age/type, roof attachment, opening protection, and compliance with current Miami-Dade code requirements.",
          "Proximity to coast and elevation will affect windborne debris and storm surge vulnerability (even if flood not requested).",
          "Warehouse contents profile may increase fuel load and volatility, affecting loss severity post-event.",
          "BI/EE exposure could be material if supply chain or utility dependencies create extended downtime."
        ]
      },
      {
        "section_title": "📑 Coverage Structure & Terms Strategy",
        "narrative": "A wind-only layer could be structured to sit co-terminous with the AOP primary, potentially mirroring the existing primary limit or attaching excess of a retention depending on appetite and CAT model outputs. Given market norms in Miami-Dade, a named storm or wind/hail deductible expressed as a percentage of TIV per location is anticipated, with potential minimum dollar deductibles. Terms may include exclusions or sublimits for wind-driven rain, roof surfacing, cosmetic damage to metal roofs, and protective safeguards, depending on construction and maintenance profiles. Business Income coverage, if sought, will require detailed BI worksheets and scrutiny of ingress/egress, civil authority, and utility service interruption endorsements to avoid silent aggregation.",
        "bullets": [
          "Consider wind-only primary or quota share to manage capacity; layering may be needed if TIV is high.",
          "Deductible guidance: likely 3%–5% named storm per location with minimums; higher for older or unprotected roofs.",
          "Evaluate need for WDR buyback, ordinance or law, debris removal, and roof limitation endorsements.",
          "Clarify whether BI/EE is requested for wind-only and define waiting periods and sublimits if applicable."
        ]
      },
      {
        "section_title": "🧾 Information Requests & Next Steps",
        "narrative": "Underwriting completion is contingent on a full data packet to enable modeling, capacity setting, and terms. Priority is a current, clean SOV with secondary modifiers, loss history, and evidence of compliance with Miami-Dade building standards. Confirming incumbent intent and desired program architecture will streamline market approach and avoid duplication of capacity.",
        "bullets": [
          "Current SOV per location: address, construction, year built, stories, square footage, occupancy split, protection class, TIV split (building/contents/BI).",
          "Secondary wind modifiers: roof age/type/cover, deck attachment, roof geometry, roof-to-wall tie-downs, opening protection ratings, parapets, year of last reroof.",
          "Risk controls: sprinklers (design density/hazard classification), fire alarms, detection, separation of flammables, HPR/NFPA compliance, hot work controls.",
          "Wind mitigation documentation: Miami-Dade NOA approvals, shutter systems, impact glazing, RTU anchorage, securement of rooftop equipment.",
          "Operational details: storage of alcohol-based products, maximum container sizes, segregation, foam systems, housekeeping, and impairment procedures.",
          "BI details: dependency mapping, utility redundancy, backup power, BI worksheet, waiting periods, max indemnity period.",
          "Cat modeling inputs: geocoded locations, distance to coast, elevation, construction quality; request RMS/AIR outputs or run internal models.",
          "Loss history: 5-year currently valued loss runs; any open claims or CAT events.",
          "Program intent: target limit for wind, deductible preference, tolerance for named storm vs. all wind, and desired effective/term alignment.",
          "Clarify policy term mismatch and confirm current incumbent arrangement and renewal timeline."
        ]
      },
      {
        "section_title": "Underwriter's Initial Assessment",
        "narrative": "Preliminary view: this is a high wind exposure in South Florida on a warehouse risk with potentially combustible contents associated with cosmetics. The absence of COPE detail and secondary wind data creates significant modeling uncertainty, necessitating conservative capacity and higher deductibles until clarified. Coverage adequacy for wind will likely require a meaningful percentage deductible and careful attention to exclusions that can materially change recoverability (e.g., wind-driven rain, roof surfacing). Initial direction is to proceed to clear and preliminarily model scenarios contingent on receipt of a complete SOV, loss runs, and mitigation evidence, targeting a wind-only placement aligned with the existing primary structure, potentially via quota-share or layered capacity depending on aggregate exposure and TIV.",
        "bullets": [
          "Key risk factors: Miami-Dade hurricane exposure; unknown roof condition/age; potential flammable contents; two-building aggregation.",
          "Coverage considerations: named storm vs. all wind, WDR terms, BI inclusion with suitable waiting periods and sublimits, ordinance or law.",
          "Pricing implications: elevated CAT rate-on-line, likely 3%–5% wind deductibles with minimums; potential need for higher attachment or shared participation.",
          "Underwriting stance: conditional interest pending full COPE, mitigation proof, loss runs, and confirmation of target limits/deductibles and incumbent’s position."
        ]
      }
    ]
  },
  "updated_date": "2025-09-02T07:07:36.485733+00:00",
  "created_date": "2025-09-02T07:04:36.030891+00:00",
  "insured": "Chemco Corporation is a long-established manufacturer specializing in cleaning, sanitation, and personal care products. Founded in 1978 by Harvey and Sylvia Lewis, the company initially focused on serving the quick service restaurant (QSR) and convenience store industries, leveraging Harvey's extensive experience as a chemist. Over the years, Chemco has grown under the leadership of the Lewis family, with Paul Lewis now at the helm, bringing additional industry insight from his background as a multi-unit restaurant owner [https://www.chemco-usa.com/about]. The company is recognized for its commitment to quality and innovation, offering a broad range of products and custom manufacturing solutions for both industrial and beauty sectors [https://www.echemco.com/], [https://www.gcimagazine.com/home/company/22765677/chemco-corp].\n\nKey operational details:\n- Chemco manufactures cleaning and sanitation products, including hand sanitizers, dishwashing agents, and specialty cleaners, with distribution across the US, Canada, EU, and the Middle East [https://www.chemco-usa.com/].\n- The company also produces professional hair, skin, and nail care products, serving both private label and branded markets, and is active in contract manufacturing for major retailers and salons [https://www.echemco.com/], [https://www.linkedin.com/company/chemco-corp].\n- Chemco operates a 120,000 sq/ft state-of-the-art facility with a staff of approximately 200, conducting business in multiple languages across five continents [https://www.echemco.com/].\n- The company offers R&D-backed custom formulation services for skincare, OTC, and industrial products, supporting clients from concept to packaging [https://echemco.com/].\n- Chemco's products are available through major retail channels such as CVS, Sephora, and Bath & Body Beyond, as well as on Amazon [https://www.amazon.com/s?i=merchant-items&me=A1X7EFUGQDGM8I], [https://www.amazon.com/Beauty-Personal-Care-Chemco-Corp/s?rh=n%3A3760911%2Cp_6%3AA1C0CES0L8PKAZ].\n\nAdditional narrative context about risks or recent developments:\n- Chemco Corporation is not currently BBB accredited, which may be relevant for reputation and trust considerations in underwriting [https://www.bbb.org/us/ma/lawrence/profile/chemical-production/chemco-corporation-0021-266981].\n- There are no publicly reported legal issues, safety violations, or financial instability in the available sources, but underwriters may wish to review D&B and FDA filings for further due diligence [https://www.dnb.com/business-directory/company-profiles.chemco_corporation.26881ef8a37d060f8f47fdd74043a968.html], [https://fda.report/Company/Chemco-Corp].\n- Chemco emphasizes technology-driven, sustainable practices and maintains high standards for service and technical support, which may mitigate certain operational risks [https://www.chemcoprod.com/].\n\nOverall, Chemco Corporation presents as a reputable, multi-generational manufacturer with diversified operations in both industrial and beauty product sectors, supported by robust R&D and global distribution.",
  "loss_run": {
    "analysis_sections": [
      {
        "section_title": "Loss Data Overview",
        "narrative": "📄 The submission contains no usable historical loss information across the last five policy periods; all rows indicate that loss runs were not provided, and the totals reflect zero only because data is absent, not because losses are verified as nil. As a result, loss experience cannot be credibly assessed at this time, and any pricing or coverage proposal must rely on industry benchmarks, exposure analytics, and protective terms until validated loss runs are furnished.",
        "bullets": [
          "No currently valued loss runs provided for 01/01/2020–01/01/2025.",
          "Totals (zero claims, zero incurred) are placeholders due to missing data, not confirmed performance.",
          "No indication of claim frequency, severity, trend, or litigation propensity.",
          "Carrier history and reserving philosophy unknown; credibility of any loss pick is minimal without documentation."
        ]
      },
      {
        "section_title": "Data Gaps and Credibility Considerations",
        "narrative": "🔍 The absence of five years of valued loss runs introduces a high degree of model uncertainty and adverse selection risk. Without frequency/severity history, we must assume potential for both latent claims and underreported incidents. Credibility weighting of the account’s experience is effectively zero, necessitating reliance on class-based expected loss rates with a conservatism factor and explicit subjectivities to convert any indication to bindable terms.",
        "bullets": [
          "Require 5 years of currently valued, carrier-issued loss runs (valuation within 60–90 days).",
          "If new venture: obtain signed no-loss letter and detailed operational narrative; otherwise, insist on prior carrier loss runs.",
          "Secure warranty statement of no known losses, incidents, or circumstances likely to give rise to claims.",
          "Consider IBNR loading given unknown reporting patterns and lag by line of business.",
          "Defer credibility until loss runs received; initial loss pick based on industry ELR/LLAE with conservatism."
        ]
      },
      {
        "section_title": "Pricing, Terms, and Coverage Implications",
        "narrative": "💡 In the absence of verified loss history, pricing should start at or above class minimums using benchmark expected loss rates plus a surcharge for uncertainty. Terms should be structured to mitigate unknown severity exposures via deductibles/retentions, sublimits on severity-prone perils, and tightened conditions around late reporting. Coverage enhancements should be deferred until loss validation; conversely, protective endorsements and risk controls should be front-loaded to stabilize loss emergence.",
        "bullets": [
          "Apply uncertainty surcharge (e.g., +10% to +25%) over class-based technical rate due to zero-credibility history.",
          "Set meaningful per-occurrence deductible or SIR to align insured participation and filter attritional losses.",
          "Consider sublimits or exclusions for severity drivers (contractual liability expansions, abuse/molestation, cyber, employee-related exposures) pending loss verification and risk detail.",
          "Include prior work/known loss exclusion and conditions requiring timely claim reporting.",
          "Bind subject to receipt and satisfactory review of loss runs; re-rate with right to adjust premium, terms, or cancel if adverse history emerges.",
          "Require risk controls commensurate with line (claims handling protocols, driver/vehicle MVR and telematics, safety training, written maintenance/QA, or HR/EEO practices)."
        ]
      },
      {
        "section_title": "Underwriter's Bottom Line",
        "narrative": "✅ Recommendation: Conditional Accept. Rationale: The account presents an information risk, not an observed loss problem. With no validated loss runs for five prior terms, we cannot assign experience credibility. Offer an indication leveraging industry ELR/LLAE with an uncertainty load, protective retentions, and restrictive terms. Convert to bind only upon receipt of 5 years currently valued loss runs; adjust rate/terms post-review. If loss documentation is not produced within the stipulated timeframe or reveals adverse loss patterns, decline or re-price accordingly. Portfolio fit is acceptable on a controlled, subject-to basis where we can manage downside via pricing, structure, and subjectivities.",
        "bullets": [
          "Subjectivities/Conditions: 5 years of currently valued carrier loss runs; no-loss warranty; signed anti-fraud and disclosure statements; confirmation of operations/exposure basis; implement agreed risk controls within 60 days.",
          "Pricing Factors: Class-based ELR + LLAE; +10%–25% uncertainty load; minimum premium guardrails; deductible/SIR to filter attritional losses; IBNR/late-reporting margin.",
          "Terms/Exclusions: Prior/known loss exclusion; sublimit or exclude severity-prone endorsements until validation; tighten notice and cooperation conditions; right to re-rate or cancel if loss runs are adverse or not received.",
          "Rate Adequacy: Treat as zero-credibility—do not credit for clean history; revisit pricing after verified loss runs allow credible loss pick and trend.",
          "Decision Trigger: Decline if loss runs not received by binding deadline or if adverse loss ratio/severity trend exceeds appetite thresholds."
        ]
      }
    ],
    "numerical_trends": [
      {
        "year": 2020,
        "loss_amount": 0,
        "claims_count": 0
      },
      {
        "year": 2021,
        "loss_amount": 90000,
        "claims_count": 1
      },
      {
        "year": 2022,
        "loss_amount": 80000,
        "claims_count":2
      },
      {
        "year": 2023,
        "loss_amount": 0,
        "claims_count": 0
      },
      {
        "year": 2024,
        "loss_amount": 0,
        "claims_count": 0
      }
    ]
  },
  "sov": {
    "analysis_sections": [
      {
        "section_title": "📊 TIV Assessment",
        "narrative": "Single-site Florida coastal condo association with consolidated TIV estimated at $19.05M. The primary reinforced-concrete residential tower drives ~95% of exposure ($18.18M, 133,200 sf, ~ $136/sf). Ancillary exposures (pool building and multiple outdoor/other structures, including seawall, carports, piers/decks, retaining and pool walls) contribute ~4–5% of TIV. For a 1974 high-rise concrete structure in Volusia County with 2017 roof/update, $136/sf appears light versus current Florida replacement cost benchmarks for coastal, code-compliant reconstruction, suggesting potential underinsurance risk, especially when considering demolition, code upgrades, and inflationary pressures.",
        "bullets": [
          "Estimated total TIV: ~$19,047,326 across one parcel.",
          "Primary building drives ~95% of total exposure; outdoor/ancillary structures ~4–5%.",
          "Indicative RC adequacy: ~$136/sf for FR concrete on coast likely below current market.",
          "Inflation, supply-chain volatility, and post-cat escalation amplify adequacy concerns."
        ]
      },
      {
        "section_title": "🧾 Coverage Distribution Analysis",
        "narrative": "Values are heavily concentrated in the building line; contents are minimal ($50K) and no BI/Rental Value is declared for any location. For a condo association, absence of BI/EE or loss of rents/assessments coverage could create significant uninsured exposure to association income streams and unit owner assessments after a loss. No explicit Ordinance or Law allocation is shown—critical for a 1974 structure in a stringent Florida code environment, where partial losses may trigger substantial upgrade requirements under the 50% rule.",
        "bullets": [
          "BI/Rental Value: $0; evaluate need for Loss of Assessments/Association Income.",
          "Contents: $50K only; confirm adequacy for common areas, office, fitness, pool equipment.",
          "No explicit O&L limits shown (A/B/C); high relevance for pre-modern-code building.",
          "Outdoor/other structures appear scheduled but may need specific sublimits/terms."
        ]
      },
      {
        "section_title": "🌪️ Geographic & CAT Risk Concentration",
        "narrative": "All assets are located at a single coastal address on S Peninsula Dr, Port Orange (Volusia County), indicating high aggregation and susceptibility to Atlantic hurricane wind, storm surge, and flood. Seawall, piers/decks, pool structures, and carports are particularly vulnerable to wind, debris impact, saltwater corrosion, and hydrodynamic forces. Flood zone data is absent; however, the peninsula setting strongly suggests Special Flood Hazard Area exposure. Expect meaningful wind catastrophe load, elevated named-storm deductible considerations, and careful review of flood/NSL exposures.",
        "bullets": [
          "Single-location aggregation: 100% exposure within a coastal CAT zone.",
          "Key secondaries: surge/flood, wind-borne debris, corrosion/maintenance from salt air.",
          "Seawall and waterfront structures often excluded or tightly sublimited—clarify intent.",
          "Obtain elevation certificates, NFIP status, and flood zone to calibrate terms and pricing."
        ]
      },
      {
        "section_title": "🏗️ Construction, Age & Protection Evaluation",
        "narrative": "Primary building is Reinforced Concrete MRF (fire-resistive) with a 2017 single-ply flat roof, which is favorable for structural performance and fire spread limitation; however, the building is reported as unsprinklered—materially elevating fire severity potential for a multi-story residential occupancy. The pool building is Joisted Masonry (combustible roof framing) of 1974 vintage with limited data on protection—heightened fire and wind vulnerability. Numerous critical data points are missing (stories, alarms, standpipes, opening protection, roof attachments, permanent generators), and updates are broadly stated as 2017 without detail on life-safety or wind mitigation completion.",
        "bullets": [
          "Main tower: FR concrete, 2017 roof—positive; lack of sprinklers—negative severity driver.",
          "Secondary building: JM, small footprint but higher combustibility and wind loss potential.",
          "Unknowns: fire alarm/monitoring, standpipes, pump rooms, opening protection/impact glass.",
          "2017 update scope unclear (electrical/plumbing/life-safety/wind mitigation not specified)."
        ]
      },
      {
        "section_title": "✅ Underwriter's Assessment",
        "narrative": "Overall, this is a single-site, coastal Florida condo association with high wind/surge aggregation, a largely fire-resistive primary structure but no sprinklers, and several vulnerable outdoor/waterfront structures. Valuation appears potentially light (~$136/sf) for RC in this market, particularly given potential code upgrades and demolition costs for a 1974 building. Coverage allocation is building-heavy with effectively no time-element protection and no explicit O&L—creating material post-loss financial exposure for the association. Pricing should reflect elevated CAT load (wind/surge), lack of sprinklers, and uncertainty around mitigation and protection. Recommendation: proceed only with targeted terms—validate RC adequacy, require flood information and wind mitigation data, introduce robust O&L and appropriate sublimits/deductibles, and consider BI/association income solutions. If valuation and mitigation details cannot be satisfied, consider pricing surcharges and/or restrictive terms; if materially inadequate, consider declination.",
        "bullets": [
          "Bind subject to: updated RC valuation support (contractor/Marshall & Swift), flood zone/Elev Cert, and wind mitigation (roof attachments, secondary water barrier, opening protection).",
          "Coverage adds: Ordinance or Law A/B/C with meaningful limits; Debris Removal; consider Loss of Assessments/Association Income or BI/EE; Equipment Breakdown for common systems.",
          "Terms: Named Storm/Hurricane deductible (e.g., 3–5%) with appropriate AOP; sublimits or exclusions for seawall/piers/decks and pool/retaining walls; review outdoor property specifications.",
          "Risk management: evaluate sprinkler retrofit feasibility or enhanced detection/monitoring; maintain roof PM program; corrosion control for waterfront assets; emergency power and water intrusion plans.",
          "Pricing: apply higher CAT and uncertainty loadings; credit consideration contingent on validated mitigation and improved valuation accuracy."
        ]
      }
    ],
    "sov_charts": {
      "coverageData": [
        {
          "Coverage": "Building Value",
          "TIV": 18162195,
          "Percent": 95.4
        },
        {
          "Coverage": "Contents Value",
          "TIV": 50000,
          "Percent": 0.3
        },
        {
          "Coverage": "BI/Rental Value",
          "TIV": 0,
          "Percent": 0
        },
        {
          "Coverage": "M&E Value",
          "TIV": 0,
          "Percent": 0
        },
        {
          "Coverage": "Other Value",
          "TIV": 835131,
          "Percent": 4.4
        }
      ],
      "occupancyData": [
        {
          "Occupancy": "BUILDING",
          "TIV": 18179283,
          "Percent": 95.4
        },
        {
          "Occupancy": "CARPORT",
          "TIV": 135641,
          "Percent": 0.7
        },
        {
          "Occupancy": "CARPORT (2)",
          "TIV": 94282,
          "Percent": 0.5
        },
        {
          "Occupancy": "CONCRETE POOL WALL",
          "TIV": 40688,
          "Percent": 0.2
        },
        {
          "Occupancy": "CONCRETE RETAINING WALL",
          "TIV": 16740,
          "Percent": 0.1
        },
        {
          "Occupancy": "PIERS & DECKS",
          "TIV": 120600,
          "Percent": 0.6
        },
        {
          "Occupancy": "POOL",
          "TIV": 113305,
          "Percent": 0.6
        },
        {
          "Occupancy": "POOL BUILDING",
          "TIV": 32912,
          "Percent": 0.2
        },
        {
          "Occupancy": "SEAWALL",
          "TIV": 313875,
          "Percent": 1.6
        }
      ],
      "constructionData": [
        {
          "Construction": "JM",
          "TIV": 32912,
          "Percent": 0.2
        },
        {
          "Construction": "MFR",
          "TIV": 18179283,
          "Percent": 95.4
        },
        {
          "Construction": "Missing data",
          "TIV": 484608,
          "Percent": 2.5
        },
        {
          "Construction": "NC",
          "TIV": 350523,
          "Percent": 1.8
        }
      ],
      "yearBuiltData": [
        {
          "Year": 1974,
          "TIV": 18212195,
          "Percent": 95.6
        },
        {
          "Year": "Missing data",
          "TIV": 835131,
          "Percent": 4.4
        }
      ]
    }
  },
  "missing_info": {
    "info": [
      "Loss run for years 2024, 2023, 2022, 2021, 2020 are missing"
    ],
    "mail": {
      "subject": "Additional Information Required - Chemco Corporation",
      "body": "Dear Daniel Schumann,\n\nThank you for submitting the insurance application for Chemco Corporation. We are currently reviewing your submission and require the following additional information to complete our underwriting evaluation:\n\n1. info\n\nPlease provide the requested information at your earliest convenience so we can proceed with the quote process.\n\nIf you have any questions or need clarification on any of these items, please don't hesitate to contact us.\n\nThank you for your cooperation.\n\nBest regards,\n\nUnderwriting Team\nCommercial Insurance Division\nEmail: underwriting@company.com\nPhone: (555) 123-4567"
    }
  }
};

    setTimeout(() => {
  this.submissionDetail = mockData;
  this.isLoading = false;

  if (this.activeTab === 'sov') {
    this.createCharts();
  }
}, 1000);
  }

  private createCharts(): void {
    this.destroyCharts();
    
    if (this.activeTab === 'sov') {
      this.createPieCharts();
    } else if (this.activeTab === 'loss-run') {
      this.createLossRunChart();
    }
  }

  private createPieCharts(): void {
    const chartData = this.submissionDetail?.sov?.sov_charts;
    if (!chartData) return;

    // Coverage Chart
    if (this.coverageChartRef && chartData.coverageData?.length) {
      this.createPieChart(
        this.coverageChartRef.nativeElement,
        chartData.coverageData,
        'Coverage'
      );
    }

    // Occupancy Chart
    if (this.occupancyChartRef && chartData.occupancyData?.length) {
      this.createPieChart(
        this.occupancyChartRef.nativeElement,
        chartData.occupancyData,
        'Occupancy'
      );
    }

    // Construction Chart
    if (this.constructionChartRef && chartData.constructionData?.length) {
      this.createPieChart(
        this.constructionChartRef.nativeElement,
        chartData.constructionData,
        'Construction'
      );
    }

    // Year Built Chart
    if (this.yearBuiltChartRef && chartData.yearBuiltData?.length) {
      this.createPieChart(
        this.yearBuiltChartRef.nativeElement,
        chartData.yearBuiltData,
        'Year'
      );
    }
  }

  private createPieChart(canvas: HTMLCanvasElement, data: any[], labelKey: string): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const filteredData = data.filter(item => item.Percent > 0);
    
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: filteredData.map(item => item[labelKey]),
        datasets: [{
          data: filteredData.map(item => item.Percent),
          backgroundColor: this.chartColors.slice(0, filteredData.length),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const item = filteredData[context.dataIndex];
                return `${context.label}: $${item.TIV.toLocaleString()} (${item.Percent}%)`;
              }
            }
          }
        },
        animation: {
          duration: 1000
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createLossRunChart(): void {
    if (!this.lossRunChartRef || !this.submissionDetail?.loss_run?.numerical_trends) return;

    const ctx = this.lossRunChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const trends = this.submissionDetail.loss_run.numerical_trends;
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: trends.map((trend: any) => trend.year.toString()),
        datasets: [
          {
            label: 'Loss Amount',
            data: trends.map((trend: any) => trend.loss_amount),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Claims Count',
            data: trends.map((trend: any) => trend.claims_count * 100000), // Scale for visibility
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: 500
              }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 0) {
                  return `Loss Amount: $${context.parsed.y.toLocaleString()}`;
                } else {
                  const actualCount = Math.round(context.parsed.y / 100000);
                  return `Claims Count: ${actualCount}`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#e2e8f0'
            },
            ticks: {
              font: {
                size: 12,
                weight: 500
              },
              color: '#64748b'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: '#e2e8f0'
            },
            ticks: {
              callback: (value) => '$' + (value as number).toLocaleString(),
              font: {
                size: 12
              },
              color: '#64748b'
            },
            title: {
              display: true,
              text: 'Loss Amount ($)',
              color: '#64748b',
              font: {
                size: 12,
                weight: 600
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: (value) => Math.round((value as number) / 100000),
              font: {
                size: 12
              },
              color: '#64748b'
            },
            title: {
              display: true,
              text: 'Claims Count',
              color: '#64748b',
              font: {
                size: 12,
                weight: 600
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    
    // Create charts when switching to relevant tabs
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }

  getVisibleBullets(bullets: string[]): string[] {
    const section = this.submissionDetail?.email?.analysis_sections?.find(
      (s: any) => s.bullets === bullets
    ) || this.submissionDetail?.loss_run?.analysis_sections?.find(
      (s: any) => s.bullets === bullets
    ) || this.submissionDetail?.sov?.analysis_sections?.find(
      (s: any) => s.bullets === bullets
    );
    
    if (!section || section.expanded) {
      return bullets;
    }
    return bullets.slice(0, this.maxBullets);
  }

  toggleBulletsExpanded(section: any): void {
    section.expanded = !section.expanded;
  }

  getTotalClaims(): number {
    if (!this.submissionDetail?.loss_run?.numerical_trends) return 0;
    
    return this.submissionDetail.loss_run.numerical_trends.reduce(
      (sum: any, trend: any) => sum + trend.claims_count, 0
    );
  }

  getTotalIncurred(): number {
    if (!this.submissionDetail?.loss_run?.numerical_trends) return 0;
    
    return this.submissionDetail.loss_run.numerical_trends.reduce(
      (sum: any, trend: any) => sum + trend.loss_amount, 0
    );
  }

  getAveragePerClaim(): number {
    const totalClaims = this.getTotalClaims();
    const totalIncurred = this.getTotalIncurred();
    
    return totalClaims > 0 ? totalIncurred / totalClaims : 0;
  }

  onFollowUpSelected(question: FollowUpQuestion): void {
    // Add the follow-up question as a chat message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question.text,
      timestamp: new Date()
    };
    this.chatMessages.push(userMessage);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: `I'll help you with: ${question.text}. Based on the submission analysis, I can provide detailed insights and next steps for this request.`,
        timestamp: new Date()
      };
      this.chatMessages.push(botMessage);
    }, 1000);
  }

  onSendEmailToBroker(): void {
    this.showEmailModal = true;
  }

  onEmailModalClose(): void {
    this.showEmailModal = false;
  }

  onEmailSent(): void {
    this.showEmailModal = false;
    this.notificationService.showSuccess('Information request sent successfully to broker');
  }

  onSendMessage(message: string): void {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    this.chatMessages.push(userMessage);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: 'I understand your question about this submission. Based on the analysis, I can see there are significant concerns about missing loss runs and wind exposure data that need to be addressed for proper underwriting evaluation.',
        timestamp: new Date()
      };
      this.chatMessages.push(botMessage);
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }


   isEmailPanelOpen = false;
  isNotesPanelOpen = false;
  selectedSubmissionId = 'demo-submission-123';
  selectedNoteId = '';

  openEmailPanel(): void {
    this.isEmailPanelOpen = true;
  }

  closeEmailPanel(): void {
    this.isEmailPanelOpen = false;
  }

  openNotesPanel(): void {
    this.selectedNoteId = 'demo-note-' + Date.now();
    this.isNotesPanelOpen = true;
  }

  closeNotesPanel(): void {
    this.isNotesPanelOpen = false;
  }

  // onEmailSent(): void {
  //   console.log('Email sent successfully!');
  // }
}