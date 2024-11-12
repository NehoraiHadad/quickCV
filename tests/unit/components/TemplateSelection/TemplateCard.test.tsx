import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { TemplateCard } from '@/components/TemplateSelection/TemplateCard'

describe('TemplateCard', () => {
  const mockTemplate = {
    id: 'test-template',
    name: 'Test Template',
    preview: <div>Template Preview</div>,
    render: () => <div>Template Content</div>
  }

  const defaultProps = {
    template: mockTemplate,
    isSelected: false,
    scale: 0.2,
    onSelect: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  }

  it('renders template name correctly', () => {
    render(<TemplateCard {...defaultProps} />)
    expect(screen.getByText('Test Template')).toBeInTheDocument()
  })

  it('applies selected styles when isSelected is true', () => {
    render(<TemplateCard {...defaultProps} isSelected={true} />)
    const card = screen.getByTestId('template-test-template')
    expect(card).toHaveClass('border-blue-500')
  })

  it('calls onSelect when clicked', () => {
    render(<TemplateCard {...defaultProps} />)
    const card = screen.getByTestId('template-test-template')
    fireEvent.click(card)
    expect(defaultProps.onSelect).toHaveBeenCalledWith('test-template')
  })

  describe('Custom template features', () => {
    const customTemplate = {
      ...mockTemplate,
      id: 'custom-template'
    }

    it('shows "Custom" badge for custom templates', () => {
      render(<TemplateCard {...defaultProps} template={customTemplate} />)
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('shows edit and delete buttons for custom templates', () => {
      render(<TemplateCard {...defaultProps} template={customTemplate} />)
      expect(screen.getByRole('button', { name: 'Edit template' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete template' })).toBeInTheDocument()
    })

    it('handles edit button click without triggering template selection', () => {
      const onSelect = jest.fn();
      const onEdit = jest.fn();
      
      render(
        <TemplateCard 
          {...defaultProps}
          template={customTemplate}
          onSelect={onSelect}
          onEdit={onEdit}
        />
      );
      
      const editButton = screen.getByRole('button', { name: 'Edit template' });
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalledWith('custom-template');
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('handles delete button click without triggering template selection', () => {
      const onSelect = jest.fn();
      const onDelete = jest.fn();
      
      render(
        <TemplateCard 
          {...defaultProps}
          template={customTemplate}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      );
      
      const deleteButton = screen.getByRole('button', { name: 'Delete template' });
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalledWith('custom-template');
      expect(onSelect).not.toHaveBeenCalled();
    });
  })

  describe('Regular template features', () => {
    it('does not show edit and delete buttons for regular templates', () => {
      render(<TemplateCard {...defaultProps} />)
      expect(screen.queryByRole('button', { name: 'Edit template' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Delete template' })).not.toBeInTheDocument()
    })

    it('does not show Custom badge for regular templates', () => {
      render(<TemplateCard {...defaultProps} />)
      expect(screen.queryByText('Custom')).not.toBeInTheDocument()
    })
  })

  it('applies correct scale transformation', () => {
    render(<TemplateCard {...defaultProps} scale={0.5} />)
    const previewContainer = screen.getByTestId('template-test-template').children[0]
    expect(previewContainer).toHaveStyle({ transform: 'scale(0.5)' })
  })
}) 