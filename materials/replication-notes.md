# Post-Soviet Replication Notes

## Source files

- Manuscript: `materials/Post-Soviet_Trade_2026_05_31_Manuscript_2nd_Revision.docx`
- Dataset: `data/ExSoviet_balanced_clean.csv`
- Manuscript coefficient file: `materials/manuscript-coefficients.csv`
- Python notebook: `notebooks/post_soviet_replication_python.qmd`

## Data assumptions

The Python replication uses the cleaned balanced Post-Soviet dataset with 5,253 observations, 15 exporters, 15 importers, and years 1992-2020. The required variables are present with no missing values.

The dataset used in the current Python run contains no zero trade flows. This differs from the manuscript text, which discusses zero-inclusive PPML specifications and reports a zero-flow share in the broader CEPII-derived sample. The course dataset therefore reproduces the positive-flow model sequence exactly but cannot fully reproduce a zero-inclusive sample unless zero-flow observations are supplied.

## Why Zero-Inclusive Models Do Not Match Exactly

The current teaching dataset has zero zero-flow observations. This means every observation in `ExSoviet_balanced_clean.csv` has positive bilateral trade.

The manuscript reports zero-inclusive PPML results from a broader zero-inclusive sample. Those specifications were designed to retain bilateral dyad-year observations with zero reported trade, which can affect both the estimated coefficients and the fixed-effect structure.

Therefore, exact matching is expected for the positive-flow models: Classic OLS, FE OLS, DDM, BVU, PPML with GDP controls, and GPML. Exact matching is not necessarily expected for the zero-inclusive PPML and structural zero-inclusive PPML models when the teaching dataset excludes zero-flow observations.

This is a data-scope issue, not a Python failure. The Python code correctly estimates the specified models on the available data. To reproduce the manuscript's zero-inclusive tables exactly, students need the broader dataset that includes zero-flow dyads and the same sample restrictions used in the manuscript.

## Sample differences

Classic OLS, FE OLS, DDM, BVU, PPML with GDP controls, and GPML match the manuscript coefficients after rounding. This indicates that the cleaned dataset and the positive-flow specifications are aligned with the reported tables.

The zero-inclusive PPML and structural PPML specifications show remaining differences for several coefficients. The most likely reason is that the available course dataset has no zero-flow observations, while the manuscript's zero-inclusive tables appear to use a broader sample that retains zero trade flows.

## Estimator differences

The notebook estimates:

- Classic OLS with HC1 robust standard errors.
- FE OLS with exporter and importer fixed effects.
- Manual double-demeaned OLS.
- BVU normalized gravity using log trade intensity.
- PPML with GDP controls.
- GPML with exporter and importer fixed effects.
- Zero-inclusive PPML using all valid observations in the available dataset.
- Structural PPML with exporter-year and importer-year fixed effects.

For structural PPML, clustered standard errors by `pair_id` are feasible and were estimated in the notebook. The coefficient comparison uses coefficient values, not standard errors.

## Fixed-effect differences

GDP variables are absorbed in FE OLS, GPML, and structural PPML when exporter/importer or exporter-year/importer-year fixed effects are included. These rows are marked as not applicable in the comparison table.

The structural PPML specification absorbs time-varying exporter and importer characteristics through exporter-year and importer-year fixed effects. This makes the model closer to structural gravity but also more sensitive to the exact estimation sample.

## Remaining discrepancies

The comparison table produced:

- Exact matches: 40
- Close matches: 4
- Review items: 10
- Not applicable rows: 10

Review items are concentrated in the zero-inclusive PPML and structural PPML tables:

| Model | Variable | Main issue |
|---|---|---|
| Zero-inclusive PPML | `log_distw` | Current course dataset has no zero flows; manuscript table likely uses broader zero-inclusive sample. |
| Zero-inclusive PPML | `contig` | Current course dataset has no zero flows; manuscript table likely uses broader zero-inclusive sample. |
| Zero-inclusive PPML | `wto_joint` | Difference slightly exceeds the close threshold. |
| Zero-inclusive PPML | `EU_joint` | Current course dataset has no zero flows; manuscript table likely uses broader zero-inclusive sample. |
| Zero-inclusive PPML | `log_gdp_o` | Current course dataset has no zero flows; manuscript table likely uses broader zero-inclusive sample. |
| Zero-inclusive PPML | `log_gdp_d` | Current course dataset has no zero flows; manuscript table likely uses broader zero-inclusive sample. |
| Structural PPML | `comlang_off` | Sensitive to structural fixed effects and sample definition. |
| Structural PPML | `contig` | Sensitive to structural fixed effects and sample definition. |
| Structural PPML | `EU_joint` | Difference slightly exceeds the close threshold. |
| Structural PPML | `EAEU_joint` | Difference slightly exceeds the close threshold. |

## Recommended next checks

1. Confirm whether the manuscript's zero-inclusive tables use a dataset with zero-flow dyads not included in `ExSoviet_balanced_clean.csv`.
2. If available, add the full zero-inclusive dataset to `data/` under a separate filename.
3. Re-estimate Models 7 and 8 using the manuscript's zero-inclusive sample.
4. Confirm whether manuscript Table 8 reports clustered standard errors only or also uses a slightly different coefficient-estimation sample.
5. Preserve the current positive-flow dataset because it exactly reproduces the main positive-flow specifications after rounding.
