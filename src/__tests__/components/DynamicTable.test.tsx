/**
 * DynamicTable Component Tests
 * Demonstrates clean testing principles:
 * - Descriptive test names
 * - Given/When/Then pattern
 * - Arrange/Act/Assert structure
 * - No logic in tests
 * - One behavior per test
 * - Meaningful test data
 * - Deterministic tests
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicTable, { Column, TableAction } from '@/components/shared/DynamicTable';
import { Edit, Trash2 } from 'lucide-react';

interface TestItem {
    id: number;
    name: string;
    price: number;
    category: string;
}

// Test data factory - hides irrelevant details
function createTestItem(overrides: Partial<TestItem> = {}): TestItem {
    return {
        id: 1,
        name: 'Test Item',
        price: 10.99,
        category: 'Food',
        ...overrides,
    };
}

// Reusable test columns
const testColumns: Column<TestItem>[] = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'price', label: 'Price', align: 'right' },
    { id: 'category', label: 'Category' },
];

describe('DynamicTable', () => {
    describe('Rendering', () => {
        test('should display column headers correctly', () => {
            // Arrange
            const data = [createTestItem()];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                />
            );

            // Assert
            expect(screen.getByText('ID')).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Price')).toBeInTheDocument();
            expect(screen.getByText('Category')).toBeInTheDocument();
        });

        test('should display data rows with correct values', () => {
            // Arrange
            const testItem = createTestItem({
                id: 1,
                name: 'Margherita Pizza',
                price: 12.99,
                category: 'Italian',
            });

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[testItem]}
                    rowKey="id"
                />
            );

            // Assert
            expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
            expect(screen.getByText('Italian')).toBeInTheDocument();
        });

        test('should show empty state message when no data is provided', () => {
            // Arrange
            const emptyMessage = 'No items found';

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[]}
                    rowKey="id"
                    emptyStateMessage={emptyMessage}
                />
            );

            // Assert
            expect(screen.getByText(emptyMessage)).toBeInTheDocument();
        });

        test('should show loading spinner when loading prop is true', () => {
            // Arrange & Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[]}
                    rowKey="id"
                    loading={true}
                />
            );

            // Assert
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        test('should show error message when error prop is provided', () => {
            // Arrange
            const errorMessage = 'Failed to load data';

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[]}
                    rowKey="id"
                    error={errorMessage}
                />
            );

            // Assert
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    describe('Formatting', () => {
        test('should apply custom column formatter when provided', () => {
            // Arrange
            const columns: Column<TestItem>[] = [
                {
                    id: 'price',
                    label: 'Price',
                    format: (value: number) => `$${value.toFixed(2)}`,
                },
            ];
            const testItem = createTestItem({ price: 12.5 });

            // Act
            render(
                <DynamicTable
                    columns={columns}
                    data={[testItem]}
                    rowKey="id"
                />
            );

            // Assert
            expect(screen.getByText('$12.50')).toBeInTheDocument();
        });

        test('should align column content according to align property', () => {
            // Arrange
            const columns: Column<TestItem>[] = [
                { id: 'name', label: 'Name', align: 'left' },
                { id: 'price', label: 'Price', align: 'right' },
            ];
            const testItem = createTestItem();

            // Act
            const { container } = render(
                <DynamicTable
                    columns={columns}
                    data={[testItem]}
                    rowKey="id"
                />
            );

            // Assert
            const cells = container.querySelectorAll('td');
            expect(cells[0]).toHaveStyle({ textAlign: 'left' });
            expect(cells[1]).toHaveStyle({ textAlign: 'right' });
        });
    });

    describe('Sorting', () => {
        test('should sort data in ascending order when column header is clicked once', () => {
            // Arrange
            const data = [
                createTestItem({ id: 1, name: 'Zebra' }),
                createTestItem({ id: 2, name: 'Apple' }),
                createTestItem({ id: 3, name: 'Banana' }),
            ];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                />
            );

            const nameHeader = screen.getByText('Name');
            fireEvent.click(nameHeader);

            // Assert
            const rows = screen.getAllByRole('row');
            const firstDataRow = rows[1]; // Skip header row
            expect(within(firstDataRow).getByText('Apple')).toBeInTheDocument();
        });

        test('should sort data in descending order when column header is clicked twice', () => {
            // Arrange
            const data = [
                createTestItem({ id: 1, name: 'Apple' }),
                createTestItem({ id: 2, name: 'Banana' }),
                createTestItem({ id: 3, name: 'Zebra' }),
            ];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                />
            );

            const nameHeader = screen.getByText('Name');
            fireEvent.click(nameHeader); // First click - ascending
            fireEvent.click(nameHeader); // Second click - descending

            // Assert
            const rows = screen.getAllByRole('row');
            const firstDataRow = rows[1];
            expect(within(firstDataRow).getByText('Zebra')).toBeInTheDocument();
        });
    });

    describe('Search', () => {
        test('should filter data when search term is entered', () => {
            // Arrange
            const data = [
                createTestItem({ id: 1, name: 'Pizza' }),
                createTestItem({ id: 2, name: 'Pasta' }),
                createTestItem({ id: 3, name: 'Salad' }),
            ];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                    enableSearch={true}
                />
            );

            const searchInput = screen.getByPlaceholderText('Search...');
            fireEvent.change(searchInput, { target: { value: 'pizza' } });

            // Assert
            expect(screen.getByText('Pizza')).toBeInTheDocument();
            expect(screen.queryByText('Pasta')).not.toBeInTheDocument();
            expect(screen.queryByText('Salad')).not.toBeInTheDocument();
        });

        test('should search case-insensitively', () => {
            // Arrange
            const data = [createTestItem({ name: 'Pizza' })];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                    enableSearch={true}
                />
            );

            const searchInput = screen.getByPlaceholderText('Search...');
            fireEvent.change(searchInput, { target: { value: 'PIZZA' } });

            // Assert
            expect(screen.getByText('Pizza')).toBeInTheDocument();
        });

        test('should show empty state when search returns no results', () => {
            // Arrange
            const data = [createTestItem({ name: 'Pizza' })];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                    enableSearch={true}
                />
            );

            const searchInput = screen.getByPlaceholderText('Search...');
            fireEvent.change(searchInput, { target: { value: 'NonexistentItem' } });

            // Assert
            expect(screen.getByText('No data available')).toBeInTheDocument();
        });
    });

    describe('Pagination', () => {
        test('should display pagination controls when enabled', () => {
            // Arrange
            const data = Array.from({ length: 20 }, (_, i) =>
                createTestItem({ id: i + 1, name: `Item ${i + 1}` })
            );

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                    enablePagination={true}
                    initialRowsPerPage={10}
                />
            );

            // Assert
            expect(screen.getByText('Rows per page:')).toBeInTheDocument();
        });

        test('should show only first page items initially', () => {
            // Arrange
            const data = [
                createTestItem({ id: 1, name: 'Item 1' }),
                createTestItem({ id: 2, name: 'Item 2' }),
                createTestItem({ id: 11, name: 'Item 11' }),
            ];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    rowKey="id"
                    enablePagination={true}
                    initialRowsPerPage={2}
                />
            );

            // Assert
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.queryByText('Item 11')).not.toBeInTheDocument();
        });
    });

    describe('Actions', () => {
        test('should render action buttons for each row', () => {
            // Arrange
            const handleEdit = jest.fn();
            const actions: TableAction<TestItem>[] = [
                {
                    icon: <Edit data-testid="edit-icon" />,
                    label: 'Edit',
                    onClick: handleEdit,
                },
            ];
            const data = [createTestItem()];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={data}
                    actions={actions}
                    rowKey="id"
                />
            );

            // Assert
            expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
        });

        test('should call onClick handler when action button is clicked', () => {
            // Arrange
            const handleEdit = jest.fn();
            const testItem = createTestItem({ id: 1, name: 'Pizza' });
            const actions: TableAction<TestItem>[] = [
                {
                    icon: <Edit />,
                    label: 'Edit',
                    onClick: handleEdit,
                },
            ];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[testItem]}
                    actions={actions}
                    rowKey="id"
                />
            );

            const editButton = screen.getByLabelText('Edit');
            fireEvent.click(editButton);

            // Assert
            expect(handleEdit).toHaveBeenCalledTimes(1);
            expect(handleEdit).toHaveBeenCalledWith(testItem);
        });

        test('should not render action when show condition returns false', () => {
            // Arrange
            const actions: TableAction<TestItem>[] = [
                {
                    icon: <Trash2 />,
                    label: 'Delete',
                    onClick: jest.fn(),
                    show: (row) => row.price > 100, // Only show for expensive items
                },
            ];
            const cheapItem = createTestItem({ price: 10 });

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[cheapItem]}
                    actions={actions}
                    rowKey="id"
                />
            );

            // Assert
            expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
        });

        test('should render action when show condition returns true', () => {
            // Arrange
            const actions: TableAction<TestItem>[] = [
                {
                    icon: <Trash2 />,
                    label: 'Delete',
                    onClick: jest.fn(),
                    show: (row) => row.price > 100,
                },
            ];
            const expensiveItem = createTestItem({ price: 150 });

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[expensiveItem]}
                    actions={actions}
                    rowKey="id"
                />
            );

            // Assert
            expect(screen.getByLabelText('Delete')).toBeInTheDocument();
        });
    });

    describe('Row Click', () => {
        test('should call onRowClick handler when row is clicked', () => {
            // Arrange
            const handleRowClick = jest.fn();
            const testItem = createTestItem();

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[testItem]}
                    rowKey="id"
                    onRowClick={handleRowClick}
                />
            );

            const row = screen.getByText('Test Item').closest('tr');
            if (row) fireEvent.click(row);

            // Assert
            expect(handleRowClick).toHaveBeenCalledTimes(1);
            expect(handleRowClick).toHaveBeenCalledWith(testItem);
        });

        test('should not call onRowClick when action button is clicked', () => {
            // Arrange
            const handleRowClick = jest.fn();
            const handleEdit = jest.fn();
            const actions: TableAction<TestItem>[] = [
                {
                    icon: <Edit />,
                    label: 'Edit',
                    onClick: handleEdit,
                },
            ];

            // Act
            render(
                <DynamicTable
                    columns={testColumns}
                    data={[createTestItem()]}
                    actions={actions}
                    rowKey="id"
                    onRowClick={handleRowClick}
                />
            );

            const editButton = screen.getByLabelText('Edit');
            fireEvent.click(editButton);

            // Assert
            expect(handleEdit).toHaveBeenCalledTimes(1);
            expect(handleRowClick).not.toHaveBeenCalled();
        });
    });
});
