import Button from '../Form/Button';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Label, Underlined } from '../Typography';
import Input, { integerOnKeyDown, getInputErrors } from '../Form/Input';
import styles from './styles.module.scss';
import Radio from '../Form/Radio';
import Form from '../Form';
import { useForm } from 'react-hook-form';
import MultiStepPageTitle from '../PageTitle/MultiStepPageTitle';
import Infoi from '../Tooltip/Infoi';
import { truncateText } from '../../util';
export default function PureAddCropVariety({
  match,
  onSubmit,
  onError,
  useHookFormPersist,
  isSeekingCert,
  persistedFormData,
  crop,
  imageUploader,
  handleGoBack,
}) {
  const { t } = useTranslation(['translation', 'common', 'crop']);
  const COMMON_NAME = 'crop_variety_name';
  const VARIETAL = 'crop_varietal';
  const CULTIVAR = 'crop_cultivar';
  const SUPPLIER = 'supplier';
  const LIFE_CYCLE = 'lifecycle';
  const CROP_VARIETY_PHOTO_URL = 'crop_variety_photo_url';
  const HS_CODE_ID = 'hs_code_id';
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      crop_variety_photo_url: null,
      [LIFE_CYCLE]: crop[LIFE_CYCLE],
      [HS_CODE_ID]: crop?.[HS_CODE_ID],
      ...persistedFormData,
    },
  });

  const { historyCancel } = useHookFormPersist(getValues);

  const disabled = !isValid;

  const commonNameRegister = register(COMMON_NAME, { required: true });
  const varietalRegister = register(VARIETAL, {
    maxLength: { value: 200, message: t('FORM_VALIDATION.OVER_200_CHARS') },
    required: false,
  });
  const cultivarRegister = register(CULTIVAR, {
    maxLength: { value: 200, message: t('FORM_VALIDATION.OVER_200_CHARS') },
    required: false,
  });
  const supplierRegister = register(SUPPLIER, { required: isSeekingCert ? true : false });
  const lifeCycleRegister = register(LIFE_CYCLE, { required: true });
  const imageUrlRegister = register(CROP_VARIETY_PHOTO_URL, { required: false });
  const crop_variety_photo_url = watch(CROP_VARIETY_PHOTO_URL);
  const cropTranslationKey = crop.crop_translation_key;
  const cropNameLabel = cropTranslationKey
    ? t(`crop:${cropTranslationKey}`)
    : crop.crop_common_name;

  const scientificNameLabel =
    truncateText(crop.crop_genus, 22) + ' ' + truncateText(crop.crop_specie, 22);
  const progress = 33;

  return (
    <Form
      buttonGroup={
        <Button data-cy="variety-submit" disabled={disabled} fullLength>
          {isSeekingCert ? t('common:CONTINUE') : t('common:SAVE')}
        </Button>
      }
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <MultiStepPageTitle
        style={{ marginBottom: '24px' }}
        onGoBack={handleGoBack}
        onCancel={historyCancel}
        title={t('CROP.ADD_CROP')}
        value={progress}
      />

      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        {t('translation:CROP.VARIETAL_SUBTITLE')}
      </p>

      <div style={{ display: 'flex', position: 'relative' }}>
        <div style={{ width: 'fit-contents', display: 'inline-block' }}>
          <img
            src={crop.crop_photo_url}
            alt={crop.crop_common_name}
            className={styles.circleImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'crop-images/default.jpg';
            }}
          />
        </div>
        <div
          className="nameLabel"
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: '48%',
            transform: 'translateY(-50%)',
            left: '140px',
          }}
        >
          <p
            className="cropLabel"
            style={{ fontWeight: '600', fontSize: '18px', marginBottom: '0px' }}
          >
            {cropNameLabel}
          </p>
          <p
            className="scientificNameLabel"
            style={{ verticalAlign: 'top', fontStyle: 'italic', fontSize: '16px', height: '18px' }}
          >
            {scientificNameLabel}
          </p>
        </div>
      </div>
      <Input
        data-cy="crop-variety"
        style={{ marginBottom: '40px', marginTop: '40px' }}
        label={t('CROP.VARIETY_COMMON_NAME')}
        type="text"
        hookFormRegister={commonNameRegister}
        hasLeaf={false}
      />
      <Input
        data-cy="crop-varietal"
        style={{ marginBottom: '40px' }}
        label={t('CROP.VARIETY_VARIETAL')}
        type="text"
        hookFormRegister={varietalRegister}
        errors={getInputErrors(errors, 'crop_varietal')}
        hasLeaf={false}
        optional
        subText={t('CROP.VARIETAL_SUBTEXT')}
        link={'https://www.litefarm.org/post/cultivars-and-varietals'}
        placeholder={t('CROP.VARIETAL_PLACEHOLDER')}
      />
      <Input
        data-cy="crop-cultivar"
        style={{ marginBottom: '40px' }}
        label={t('CROP.VARIETY_CULTIVAR')}
        type="text"
        hookFormRegister={cultivarRegister}
        errors={getInputErrors(errors, 'crop_cultivar')}
        hasLeaf={false}
        optional
        subText={t('CROP.CULTIVAR_SUBTEXT')}
        link={'https://www.litefarm.org/post/cultivars-and-varietals'}
        placeholder={t('CROP.CULTIVAR_PLACEHOLDER')}
        hideOnFocus
      />
      {crop_variety_photo_url && (
        <img
          src={crop_variety_photo_url}
          alt={crop.crop_common_name}
          className={styles.circleImg}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'crop-images/default.jpg';
          }}
        />
      )}
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '45px',
          display: 'flex',
          width: 'inherit',
          fontSize: '16px',
          color: 'var(--iconActive)',
          lineHeight: '16px',
          cursor: 'pointer',
        }}
      >
        {React.cloneElement(imageUploader, {
          hookFormRegister: imageUrlRegister,
          targetRoute: 'crop',
        })}
        <Infoi content={t('CROP.VARIETAL_IMAGE_INFO')} />
      </div>

      <Input
        data-cy="crop-supplier"
        style={{ marginBottom: '40px' }}
        label={t('CROP_VARIETIES.SUPPLIER')}
        type="text"
        hookFormRegister={supplierRegister}
        hasLeaf={true}
        optional={!isSeekingCert}
      />

      <div>
        <div style={{ marginTop: '16px', marginBottom: '20px' }}>
          <Label
            style={{
              paddingRight: '10px',
              fontSize: '16px',
              lineHeight: '20px',
              display: 'inline-block',
            }}
          >
            {t('CROP.ANNUAL_OR_PERENNIAL')}
          </Label>
        </div>
        <div>
          <Radio label={t('CROP.ANNUAL')} value={'ANNUAL'} hookFormRegister={lifeCycleRegister} />
        </div>
        <div>
          <Radio
            label={t('CROP.PERENNIAL')}
            value={'PERENNIAL'}
            hookFormRegister={lifeCycleRegister}
          />
        </div>
      </div>
      {!isSeekingCert && (
        <Input
          label={t('CROP_DETAIL.HS_CODE')}
          style={{ paddingBottom: '16px', paddingTop: '24px' }}
          hookFormRegister={register(HS_CODE_ID, { valueAsNumber: true })}
          type={'number'}
          onKeyDown={integerOnKeyDown}
          max={9999999999}
          optional
        />
      )}
    </Form>
  );
}

PureAddCropVariety.prototype = {
  history: PropTypes.object,
  match: PropTypes.object,
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  useHookFormPersist: PropTypes.func,
  isSeekingCert: PropTypes.bool,
  persistedFormData: PropTypes.object,
  crop: PropTypes.object,
  imageUploader: PropTypes.node,
};
