import { useEnabledExtensions } from '~hooks';
import { formatText } from '~utils/intl';
import { CardSelectOption } from '~v5/common/Fields/CardSelect/types';

export enum DecisionMethod {
  Permissions = 'Permissions',
  // MultiSigPermissions = 'MultiSigPermissions',
  Reputation = 'Reputation',
}

export const useDecisionMethods = (): {
  decisionMethods: CardSelectOption<DecisionMethod>[];
} => {
  const { isVotingReputationEnabled } = useEnabledExtensions();

  return {
    decisionMethods: [
      {
        label: formatText({ id: 'actionSidebar.method.permissions' }),
        value: DecisionMethod.Permissions,
      },
      ...(isVotingReputationEnabled
        ? [
            {
              label: formatText({ id: 'actionSidebar.method.reputation' }),
              value: DecisionMethod.Reputation,
            },
          ]
        : []),
      // Uncomment when multisig extension is added
      // {
      //   label: formatText({ id: 'actionSidebar.method.multisig' }),
      //   value: DECISION_METHOD.MultiSigPermissions,
      // },
    ],
  };
};
