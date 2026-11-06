import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Toast from "../../components/Toast/Toast";
import styles from "./AddEditRecipe.module.css";
import { useAddEditRecipeLogic } from "./AddEditRecipeLogic";

const AddEditRecipe = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state, actions } = useAddEditRecipeLogic(slug);
  const { values, fieldErrors } = state;

  if (state.isLoading) return <LoadingSpinner fullPage label="Loading recipe…" />;

  if (state.loadErrorMessage) {
    return (
      <div className="content-container">
        <div className="status-message status-message--error" role="alert">
          <p>{state.loadErrorMessage}</p>
          <button type="button" className="button button--small" onClick={actions.cancel}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `${styles.input} ${hasError ? styles.inputError : ""}`;

  return (
    <div className="content-container">
      <h1 className="page-title">{state.pageTitle}</h1>

      {state.toastMessage && (
        <Toast message={state.toastMessage} type="error" onClose={actions.dismissToast} />
      )}

      <form onSubmit={actions.submit} className={styles.form} noValidate>
        {/* --- Basics --- */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Basics</legend>

          <div className={styles.formGroup}>
            <label htmlFor="recipe-title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="recipe-title"
              type="text"
              className={inputClass(Boolean(fieldErrors.title))}
              value={values.title}
              onChange={(e) => actions.setTextField("title", e.target.value)}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? "recipe-title-error" : undefined}
            />
            {fieldErrors.title && (
              <span id="recipe-title-error" className={styles.fieldError}>
                {fieldErrors.title}
              </span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-category" className={styles.label}>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="recipe-category"
                className={inputClass(Boolean(fieldErrors.categoryId))}
                value={values.categoryId}
                onChange={(e) => actions.setTextField("categoryId", e.target.value)}
                aria-invalid={Boolean(fieldErrors.categoryId)}
              >
                <option value="">Select category</option>
                {state.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {(fieldErrors.categoryId || state.categoriesErrorMessage) && (
                <span className={styles.fieldError}>
                  {fieldErrors.categoryId ?? state.categoriesErrorMessage}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="recipe-difficulty" className={styles.label}>
                Difficulty <span className={styles.required}>*</span>
              </label>
              <select
                id="recipe-difficulty"
                className={inputClass(Boolean(fieldErrors.difficulty))}
                value={values.difficulty}
                onChange={(e) => actions.setTextField("difficulty", e.target.value)}
                aria-invalid={Boolean(fieldErrors.difficulty)}
              >
                <option value="">Select difficulty</option>
                {state.difficultyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.difficulty && (
                <span className={styles.fieldError}>{fieldErrors.difficulty}</span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="recipe-prep" className={styles.label}>
                Prep time (minutes)
              </label>
              <input
                id="recipe-prep"
                type="number"
                inputMode="numeric"
                min={0}
                className={styles.input}
                value={values.prepTimeMinutes}
                onChange={(e) => actions.setMinutesField("prepTimeMinutes", e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="recipe-cook" className={styles.label}>
                Cook time (minutes)
              </label>
              <input
                id="recipe-cook"
                type="number"
                inputMode="numeric"
                min={0}
                className={styles.input}
                value={values.cookTimeMinutes}
                onChange={(e) => actions.setMinutesField("cookTimeMinutes", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="recipe-image" className={styles.label}>
              Image
            </label>
            <input
              id="recipe-image"
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={actions.selectImage}
            />
            {state.imagePreviewUrl && (
              <img src={state.imagePreviewUrl} alt="Recipe preview" className={styles.imagePreview} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="recipe-story" className={styles.label}>
              Story
            </label>
            <textarea
              id="recipe-story"
              className={styles.input}
              value={values.story}
              onChange={(e) => actions.setTextField("story", e.target.value)}
              placeholder="Where does this recipe come from? Who makes it best?"
              rows={4}
            />
          </div>
        </fieldset>

        {/* --- Ingredients --- */}
        <fieldset className={`${styles.card} ${fieldErrors.ingredients ? styles.cardError : ""}`}>
          <legend className={styles.cardTitle}>
            Ingredients <span className={styles.required}>*</span>
          </legend>
          {fieldErrors.ingredients && (
            <span className={styles.fieldError} role="alert">
              {fieldErrors.ingredients}
            </span>
          )}

          {values.ingredients.map((ingredient, index) => (
            <div key={ingredient.key} className={styles.ingredientRow}>
              <input
                type="text"
                placeholder="Qty"
                aria-label={`Ingredient ${index + 1} quantity`}
                className={`${styles.input} ${styles.inputSmall}`}
                value={ingredient.quantity}
                onChange={(e) => actions.updateIngredient(ingredient.key, "quantity", e.target.value)}
              />
              <input
                type="text"
                placeholder="Unit"
                aria-label={`Ingredient ${index + 1} unit`}
                className={`${styles.input} ${styles.inputSmall}`}
                value={ingredient.unit}
                onChange={(e) => actions.updateIngredient(ingredient.key, "unit", e.target.value)}
              />
              <input
                type="text"
                placeholder="Ingredient name"
                aria-label={`Ingredient ${index + 1} name`}
                className={`${styles.input} ${styles.inputGrow}`}
                value={ingredient.name}
                onChange={(e) => actions.updateIngredient(ingredient.key, "name", e.target.value)}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => actions.removeIngredient(ingredient.key)}
                aria-label={`Remove ingredient ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}

          <button type="button" className={styles.addButton} onClick={actions.addIngredient}>
            + Add ingredient
          </button>
        </fieldset>

        {/* --- Steps --- */}
        <fieldset className={`${styles.card} ${fieldErrors.steps ? styles.cardError : ""}`}>
          <legend className={styles.cardTitle}>
            Steps <span className={styles.required}>*</span>
          </legend>
          {fieldErrors.steps && (
            <span className={styles.fieldError} role="alert">
              {fieldErrors.steps}
            </span>
          )}

          {values.steps.map((step, index) => (
            <div key={step.key} className={styles.stepRow}>
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <textarea
                className={`${styles.input} ${styles.inputGrow}`}
                value={step.text}
                onChange={(e) => actions.updateStep(step.key, e.target.value)}
                placeholder={`Describe step ${index + 1}…`}
                aria-label={`Step ${index + 1}`}
                rows={2}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => actions.removeStep(step.key)}
                aria-label={`Remove step ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}

          <button type="button" className={styles.addButton} onClick={actions.addStep}>
            + Add step
          </button>
        </fieldset>

        <div className={styles.buttonsContainer}>
          <button type="submit" className="button" disabled={state.isSubmitting}>
            {state.submitLabel}
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={actions.cancel}
            disabled={state.isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditRecipe;
