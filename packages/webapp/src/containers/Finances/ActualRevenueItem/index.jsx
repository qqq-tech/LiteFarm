import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import FinanceGroup from '../../../components/Finances/FinanceGroup';
import { getManagementPlanCardDate } from '../../../util/moment';
import { cropVarietyEntitiesSelector } from '../../cropVarietySlice';
import { revenueTypeByIdSelector } from '../../revenueTypeSlice';
import { setSelectedSale } from '../actions';
import { getMass, getMassUnit, roundToTwoDecimal } from '../../../util';
import { useTranslation } from 'react-i18next';

const ActualRevenueItem = ({ sale, history, ...props }) => {
  const { t } = useTranslation();
  const { sale_date, customer_name, crop_variety_sale, revenue_type_id, sale_id, value } = sale;

  const dispatch = useDispatch();

  // TODO: optimize this - put in parent component or seek by id
  const cropVarietyEntities = useSelector(cropVarietyEntitiesSelector);
  const revenueType = useSelector(revenueTypeByIdSelector(revenue_type_id));

  const onClickForward = () => {
    dispatch(setSelectedSale(sale));
    history.push(`/revenue/${sale_id}`);
  };

  const getFinanceGroupProps = () => {
    if (revenueType.crop_generated) {
      const quantity_unit = getMassUnit();
      return {
        totalAmount: crop_variety_sale.reduce((total, sale) => total + sale.sale_value, 0),
        financeItemsProps: crop_variety_sale.map((cvs) => {
          const convertedQuantity = roundToTwoDecimal(getMass(cvs.quantity).toString());
          const {
            crop_variety_name,
            crop: { crop_translation_key },
          } = cropVarietyEntities[cvs.crop_variety_id];
          const title = crop_variety_name
            ? `${crop_variety_name}, ${t(`crop:${crop_translation_key}`)}`
            : t(`crop:${crop_translation_key}`);
          return {
            key: cvs.crop_variety_id,
            title,
            subtitle: `${convertedQuantity} ${quantity_unit}`,
            amount: cvs.sale_value,
          };
        }),
      };
    }
    return {
      totalAmount: value || 0,
      financeItemsProps: [
        {
          key: sale_id,
          title: revenueType.revenue_name,
          amount: value || 0,
        },
      ],
    };
  };

  return (
    <FinanceGroup
      headerTitle={getManagementPlanCardDate(sale_date)}
      headerSubtitle={customer_name}
      headerClickForward={onClickForward}
      {...getFinanceGroupProps(sale, cropVarietyEntities)}
      {...props}
    />
  );
};

ActualRevenueItem.prototype = {
  isDropDown: PropTypes.bool,
};

export default ActualRevenueItem;
