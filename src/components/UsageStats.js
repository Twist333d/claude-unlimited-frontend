import React from 'react';
import styled from 'styled-components';
import { formatTokensOrCost } from '../utils/numberFormatting';
import { Hash, DollarSign } from 'lucide-react';

const StatsContainer = styled.div`
    background-color: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spacing.md};
    height: 100%;
    overflow-y: auto;
    color: ${props => props.theme.colors.oxfordBlue};
    font-family: ${props => props.theme.typography.fontFamily.sansSerif};
`;

const StatsTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-size: ${props => props.theme.typography.fontSize.large};
  color: ${props => props.theme.colors.oxfordBlue};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const StatItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.span`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-size: ${props => props.theme.typography.fontSize.small};
  color: ${props => props.theme.colors.paleSky};
`;

const StatValue = styled.span`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.oxfordBlue};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
  margin: ${props => props.theme.spacing.md} 0;
`;

const SubTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.oxfordBlue};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const CollapsedStats = styled.div`
    writing-mode: vertical-rl;
    text-orientation: mixed;
    padding: ${props => props.theme.spacing.md};
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.oxfordBlue};
    font-family: ${props => props.theme.typography.fontFamily.sansSerif};
`;

function UsageStats({ usage, isCollapsed }) {
  if (isCollapsed) {
    return (
      <CollapsedStats>
        Usage: {usage && usage.total_cost ? formatTokensOrCost(usage.total_cost, true) : 'N/A'}
      </CollapsedStats>
    );
  }

  if (!usage) return <StatsContainer>Loading usage statistics...</StatsContainer>;

  return (
    <StatsContainer>
      <StatsTitle>Usage Statistics</StatsTitle>

      <SubTitle><Hash size={16} /> Usage</SubTitle>
      <StatItem>
        <StatLabel>Input Tokens:</StatLabel>
        <StatValue>{formatTokensOrCost(usage.total_input || 0)}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>Output Tokens:</StatLabel>
        <StatValue>{formatTokensOrCost(usage.total_output || 0)}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>Total Tokens:</StatLabel>
        <StatValue>{formatTokensOrCost(usage.total_tokens || 0)}</StatValue>
      </StatItem>

      <Divider />

      <SubTitle><DollarSign size={16} /> Costs</SubTitle>
      <StatItem>
        <StatLabel>Input Cost:</StatLabel>
        <StatValue>{formatTokensOrCost(usage.total_input_cost || 0, true)}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>Output Cost:</StatLabel>
        <StatValue>{formatTokensOrCost(usage.total_output_cost || 0, true)}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>Total Cost:</StatLabel>
        <StatValue>{formatTokensOrCost(usage.total_cost || 0, true)}</StatValue>
      </StatItem>
    </StatsContainer>
  );
}

export default React.memo(UsageStats);